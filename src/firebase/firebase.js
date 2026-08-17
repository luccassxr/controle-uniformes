/**
 * =============================================================================
 * ARQUIVO CENTRAL DO FIREBASE — UNICONTROL
 * =============================================================================
 *
 * Projeto Firebase atual: unicontrol-1d0d6
 *
 * Também é necessário:
 * 1. Authentication → ativar "E-mail/Senha"
 * 2. Firestore → criar banco de dados
 * 3. Publicar firestore.rules (raiz do projeto)
 * 4. Criar usuário admin@unicontrol.com no Authentication
 * =============================================================================
 */
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDKKIRqUoFHZqX__9gbgRmrdrBGl1kx1nQ',
  authDomain: 'unicontrol-1d0d6.firebaseapp.com',
  projectId: 'unicontrol-1d0d6',
  storageBucket: 'unicontrol-1d0d6.firebasestorage.app',
  messagingSenderId: '411337662207',
  appId: '1:411337662207:web:1f686675ac75fe61a676ca',
}

const app = initializeApp(firebaseConfig)

/** Firebase Authentication — cadastro, login, logout, recuperar senha, sessão */
export const auth = getAuth(app)

/** Cloud Firestore — coleções users e uniformes */
export const db = getFirestore(app)

export { firebaseConfig }
export default app
