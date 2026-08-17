/**
 * =============================================================================
 * ARQUIVO CENTRAL DO FIREBASE — UNICONTROL
 * =============================================================================
 *
 * ONDE COLAR O firebaseConfig:
 * Cole o objeto abaixo (do Firebase Console → Configurações do projeto →
 * Seus apps → SDK da Web) na constante firebaseConfig deste arquivo.
 *
 * Console: https://console.firebase.google.com → projeto tcc-lucas-88ee4
 *
 * Também é necessário:
 * 1. Authentication → ativar "E-mail/Senha"
 * 2. Firestore → criar banco de dados
 * 3. Publicar firestore.rules (raiz do projeto)
 * 4. Criar usuário admin@unicontrol.com / admin123 no Authentication
 * =============================================================================
 */
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAF_hRyZRSnQlYWZ7wwxzQFLAgF8IAGSww',
  authDomain: 'tcc-lucas-88ee4.firebaseapp.com',
  projectId: 'tcc-lucas-88ee4',
  storageBucket: 'tcc-lucas-88ee4.firebasestorage.app',
  messagingSenderId: '634398164330',
  appId: '1:634398164330:web:1c3f07f67f081ae1995113',
  measurementId: 'G-LL2JMYTG57',
}

const app = initializeApp(firebaseConfig)

/** Firebase Authentication — cadastro, login, logout, recuperar senha, sessão */
export const auth = getAuth(app)

/** Cloud Firestore — coleções users e uniformes */
export const db = getFirestore(app)

export { firebaseConfig }
export default app
