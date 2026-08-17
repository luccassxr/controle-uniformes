/**
 * Firebase Authentication — cadastro, login, logout, recuperar senha.
 * Sessão mantida automaticamente via onAuthStateChanged no AuthContext.
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/firebase'
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
  }
  return messages[code] || 'Erro de autenticação. Tente novamente.'
}

/** Garante documento em users com role correto (admin ou student) */
export async function ensureUserProfile(user, nome = '') {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  const isAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  const role = isAdmin ? ROLES.ADMIN : ROLES.STUDENT

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      nome: nome || (isAdmin ? 'Administrador' : ''),
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
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? { uid, ...snap.data() } : null
}

/** Cadastro de aluno — Auth + documento users */
export async function registerStudent(nome, email, password) {
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    throw new Error('Este e-mail é reservado para o administrador.')
  }
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: nome })
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      email,
      nome: nome.trim(),
      role: ROLES.STUDENT,
      matricula: '',
      serie: '',
      turno: '',
      criadoEm: serverTimestamp(),
    })
    await signOut(auth)
    return cred.user
  } catch (err) {
    throw new Error(mapAuthError(err.code))
  }
}

export async function loginUser(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password)
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
    await sendPasswordResetEmail(auth, email)
  } catch (err) {
    throw new Error(mapAuthError(err.code))
  }
}
