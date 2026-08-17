/**
 * Firestore — coleções users e uniformes.
 *
 * users: uid, nome, email, role, matricula, serie, turno
 * uniformes: userId, camiseta, jaqueta, calca, bermuda, shortSaia, tenis, atualizadoEm
 */
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { ROLES, PIECE_KEYS } from '../constants/roles'

const usersCol = () => collection(db, 'users')
const userDoc = (uid) => doc(db, 'users', uid)
const uniformeDoc = (uid) => doc(db, 'uniformes', uid)
/** Índice auxiliar para impedir matrícula duplicada (doc id = matrícula) */
const matriculaIndexDoc = (matricula) => doc(db, 'matriculas', matricula.trim())

const EMPTY_UNIFORME = {
  camiseta: '',
  jaqueta: '',
  calca: '',
  bermuda: '',
  shortSaia: '',
  tenis: '',
}

/** Perfil do usuário (coleção users) */
export async function getUser(uid) {
  const snap = await getDoc(userDoc(uid))
  if (!snap.exists()) return null
  return { uid: snap.id, ...snap.data() }
}

/** Uniforme do aluno (coleção uniformes, doc id = userId) */
export async function getUniforme(uid) {
  const snap = await getDoc(uniformeDoc(uid))
  if (!snap.exists()) return { userId: uid, ...EMPTY_UNIFORME }
  return { id: snap.id, ...snap.data() }
}

async function isMatriculaTaken(matricula, currentUid) {
  const normalized = matricula.trim()
  if (!normalized) return false
  const snap = await getDoc(matriculaIndexDoc(normalized))
  if (!snap.exists()) return false
  return snap.data().uid !== currentUid
}

/** Salva dados do aluno na coleção users */
export async function saveUserData(uid, email, data) {
  const nome = data.nome.trim()
  const matricula = data.matricula.trim()
  const { turno, serie } = data

  if (await isMatriculaTaken(matricula, uid)) {
    throw new Error('Esta matrícula já está cadastrada para outro aluno.')
  }

  const existing = await getUser(uid)
  if (existing?.matricula && existing.matricula !== matricula) {
    await deleteDoc(matriculaIndexDoc(existing.matricula))
  }

  await setDoc(
    userDoc(uid),
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

  await setDoc(matriculaIndexDoc(matricula), { uid })

  const uniformeSnap = await getDoc(uniformeDoc(uid))
  if (!uniformeSnap.exists()) {
    await setDoc(uniformeDoc(uid), {
      userId: uid,
      ...EMPTY_UNIFORME,
      atualizadoEm: serverTimestamp(),
    })
  }

  return getUser(uid)
}

/** Salva tamanho de uma peça na coleção uniformes */
export async function savePieceSize(uid, pieceKey, size) {
  const user = await getUser(uid)
  if (!user?.matricula) {
    throw new Error('Cadastre primeiro seus dados em Cadastro de Uniformes.')
  }

  await setDoc(
    uniformeDoc(uid),
    {
      userId: uid,
      [pieceKey]: size,
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
        camiseta: uniforme.camiseta || '',
        jaqueta: uniforme.jaqueta || '',
        calca: uniforme.calca || '',
        bermuda: uniforme.bermuda || '',
        shortSaia: uniforme.shortSaia || '',
        tenis: uniforme.tenis || '',
      }
    })
  )

  return list.sort((a, b) => a.nome.localeCompare(b.nome))
}

/** Contagem de tamanhos por peça (dashboard) */
export function countSizesByPiece(students, field) {
  const counts = {}
  students.forEach((s) => {
    const size = s[field]
    if (size) counts[size] = (counts[size] || 0) + 1
  })
  return counts
}

export { PIECE_KEYS }
