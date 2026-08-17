/**
 * Firebase Authentication — cadastro, login, logout, recuperar senha.
 */
import { initializeApp, deleteApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  getAuth,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp, getFirestore } from 'firebase/firestore'
import { auth, db, firebaseConfig } from '../firebase/firebase'
import { ADMIN_EMAIL, ROLES } from '../constants/roles'

function mapAuthError(code) {
  const messages = {
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/invalid-email': 'E-mail inválido.',
    'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres).',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/too-many-requests': 'Muitas tentativas. Tente mais tarde.',
    'auth/network-request-failed': 'Falha de conexão. Verifique a internet e tente novamente.',
  }
  return messages[code] || 'Erro de autenticação. Tente novamente.'
}

export async function ensureUserProfile(user, nome = '') {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  const isAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  const role = isAdmin ? ROLES.ADMIN : ROLES.STUDENT

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      nome: nome || user.displayName || (isAdmin ? 'Administrador' : ''),
      role,
      matricula: '',
      serie: '',
      turno: '',
      criadoEm: serverTimestamp(),
    })
  } else if (isAdmin && snap.data().role !== ROLES.ADMIN) {
    await setDoc(ref, { role: ROLES.ADMIN }, { merge: true })
  }

  return role
}

export async function getUserProfile(uid) {
  if (!uid) return null
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? { uid, ...snap.data() } : null
}

/**
 * Cria a conta em uma instância Firebase isolada.
 * Assim o novo aluno não entra automaticamente na sessão principal durante o cadastro.
 */
export async function registerStudent(nome, email, password) {
  const normalizedName = String(nome || '').trim()
  const normalizedEmail = String(email || '').trim().toLowerCase()

  if (!normalizedName) throw new Error('Informe o nome.')
  if (normalizedEmail === ADMIN_EMAIL.toLowerCase()) {
    throw new Error('Este e-mail é reservado para o administrador.')
  }

  const registrationApp = initializeApp(
    firebaseConfig,
    `registration-${Date.now()}-${Math.random().toString(36).slice(2)}`
  )
  const registrationAuth = getAuth(registrationApp)
  const registrationDb = getFirestore(registrationApp)

  try {
    const cred = await createUserWithEmailAndPassword(
      registrationAuth,
      normalizedEmail,
      password
    )
    await updateProfile(cred.user, { displayName: normalizedName })
    await setDoc(doc(registrationDb, 'users', cred.user.uid), {
      uid: cred.user.uid,
      email: normalizedEmail,
      nome: normalizedName,
      role: ROLES.STUDENT,
      matricula: '',
      serie: '',
      turno: '',
      criadoEm: serverTimestamp(),
    })
    await signOut(registrationAuth)
    return cred.user
  } catch (err) {
    throw new Error(mapAuthError(err.code))
  } finally {
    await deleteApp(registrationApp)
  }
}

export async function loginUser(email, password) {
  try {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password)
    const role = await ensureUserProfile(cred.user)
    return { user: cred.user, role }
  } catch (err) {
    throw new Error(mapAuthError(err.code))
  }
}

export async function logoutUser() {
  await signOut(auth)
}

export async function resetPassword(email) {
  try {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    await sendPasswordResetEmail(auth, normalizedEmail)
  } catch (err) {
    throw new Error(mapAuthError(err.code))
  }
}
