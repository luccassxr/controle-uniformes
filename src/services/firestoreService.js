/**
 * Firestore — coleções users e uniformes.
 *
 * users: uid, nome, email, role, matricula, serie, turno
 * uniformes: userId, camiseta, jaqueta, calca, bermuda, shortSaia, tenis, atualizadoEm
 */
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  query,
  where,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { ROLES, PIECE_KEYS } from '../constants/roles'

const usersCol = () => collection(db, 'users')
const userDoc = (uid) => doc(db, 'users', uid)
const uniformeDoc = (uid) => doc(db, 'uniformes', uid)
const matriculaIndexDoc = (matricula) => doc(db, 'matriculas', matricula.trim())

const EMPTY_UNIFORME = {
  camiseta: '',
  jaqueta: '',
  calca: '',
  bermuda: '',
  shortSaia: '',
  tenis: '',
}

const ALLOWED_PIECES = new Set(Object.values(PIECE_KEYS))

export async function getUser(uid) {
  if (!uid) return null
  const snap = await getDoc(userDoc(uid))
  if (!snap.exists()) return null
  return { uid: snap.id, ...snap.data() }
}

export async function getUniforme(uid) {
  if (!uid) return null
  const snap = await getDoc(uniformeDoc(uid))
  if (!snap.exists()) return { userId: uid, ...EMPTY_UNIFORME }
  return { id: snap.id, ...snap.data() }
}

/**
 * Salva os dados do aluno e o índice de matrícula em uma única transação.
 * Assim não fica matrícula antiga/duplicada se houver falha no meio da gravação.
 */
export async function saveUserData(uid, email, data) {
  const nome = String(data.nome || '').trim()
  const matricula = String(data.matricula || '').trim()
  const turno = String(data.turno || '').trim()
  const serie = String(data.serie || '').trim()

  if (!uid || !email || !nome || !matricula || !turno || !serie) {
    throw new Error('Preencha todos os dados obrigatórios antes de continuar.')
  }

  await runTransaction(db, async (transaction) => {
    const userRef = userDoc(uid)
    const uniformeRef = uniformeDoc(uid)
    const novaMatriculaRef = matriculaIndexDoc(matricula)

    const userSnap = await transaction.get(userRef)
    const uniformeSnap = await transaction.get(uniformeRef)
    const novaMatriculaSnap = await transaction.get(novaMatriculaRef)

    const existing = userSnap.exists() ? userSnap.data() : null
    const matriculaAntiga = String(existing?.matricula || '').trim()

    if (novaMatriculaSnap.exists() && novaMatriculaSnap.data().uid !== uid) {
      throw new Error('Esta matrícula já está cadastrada para outro aluno.')
    }

    transaction.set(
      userRef,
      {
        uid,
        nome,
        email,
        role: ROLES.STUDENT,
        matricula,
        serie,
        turno,
      },
      { merge: true }
    )

    if (matriculaAntiga && matriculaAntiga !== matricula) {
      transaction.delete(matriculaIndexDoc(matriculaAntiga))
    }

    transaction.set(novaMatriculaRef, { uid })

    if (!uniformeSnap.exists()) {
      transaction.set(uniformeRef, {
        userId: uid,
        ...EMPTY_UNIFORME,
        atualizadoEm: serverTimestamp(),
      })
    }
  })

  return getUser(uid)
}

/** Salva tamanho de uma peça na coleção uniformes */
export async function savePieceSize(uid, pieceKey, size) {
  if (!uid) throw new Error('Usuário inválido.')
  if (!ALLOWED_PIECES.has(pieceKey)) throw new Error('Peça de uniforme inválida.')

  const normalizedSize = String(size ?? '').trim()
  if (!normalizedSize) throw new Error('Selecione um tamanho válido.')

  const user = await getUser(uid)
  if (!user?.matricula) {
    throw new Error('Cadastre primeiro seus dados em Cadastro de Uniformes.')
  }

  await setDoc(
    uniformeDoc(uid),
    {
      userId: uid,
      [pieceKey]: normalizedSize,
      atualizadoEm: serverTimestamp(),
    },
    { merge: true }
  )

  return getUniforme(uid)
}

/** Lista alunos + uniformes para o dashboard admin */
export async function getAllStudentsWithUniformes() {
  const q = query(usersCol(), where('role', '==', ROLES.STUDENT))
  const usersSnap = await getDocs(q)

  const list = await Promise.all(
    usersSnap.docs.map(async (userSnap) => {
      const user = { uid: userSnap.id, ...userSnap.data() }
      const uniforme = await getUniforme(userSnap.id)
      return {
        uid: user.uid,
        nome: user.nome || '',
        email: user.email || '',
        matricula: user.matricula || '',
        turno: user.turno || '',
        serie: user.serie || '',
        camiseta: uniforme?.camiseta || '',
        jaqueta: uniforme?.jaqueta || '',
        calca: uniforme?.calca || '',
        bermuda: uniforme?.bermuda || '',
        shortSaia: uniforme?.shortSaia || '',
        tenis: uniforme?.tenis || '',
      }
    })
  )

  return list.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
}

export function countSizesByPiece(students, field) {
  const counts = {}
  students.forEach((s) => {
    const size = s[field]
    if (size) counts[size] = (counts[size] || 0) + 1
  })
  return counts
}

export { PIECE_KEYS }
