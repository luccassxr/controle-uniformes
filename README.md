# UNICONTROL

Gestão e entrega de uniformes escolares — **Firebase Authentication + Firestore**.

Projeto: **tcc-lucas-88ee4**

## Onde está a configuração do Firebase?

Toda a configuração está centralizada em:

```
src/firebase/firebase.js
```

Cole ou edite o objeto `firebaseConfig` nesse arquivo (já preenchido com o projeto `tcc-lucas-88ee4`).

Exports disponíveis:

- `auth` — Authentication
- `db` — Firestore
- `firebaseConfig` — objeto de configuração

## Como rodar

```bash
cd unicontrol
npm install
npm run dev
```

Abra `http://localhost:5173`.

## Configuração no Firebase Console

### 1. Authentication

- Ative o método **E-mail/Senha**
- Crie o usuário administrador:
  - **E-mail:** `admin@unicontrol.com`
  - **Senha:** `admin123`
- No primeiro login, o app grava `role: "admin"` em `users/{uid}`

### 2. Firestore

Crie o banco e publique as regras do arquivo `firestore.rules`.

### 3. Coleções

| Coleção | Documento | Campos |
|---------|-----------|--------|
| `users` | `{uid}` | uid, nome, email, role, matricula, serie, turno |
| `uniformes` | `{uid}` (= userId) | userId, camiseta, jaqueta, calca, bermuda, shortSaia, tenis, atualizadoEm |
| `matriculas` | `{matricula}` | uid (índice anti-duplicidade) |

## Fluxos

### Aluno

1. **Cadastro** → Auth + `users` (role: student)
2. **Login** → menu (`/menu`) — sessão mantida ao recarregar
3. **Cadastro de dados** → `users` (nome, matrícula, turno, série)
4. **Tamanhos das peças** → `uniformes`

### Administrador

1. **Login** `admin@unicontrol.com` / `admin123`
2. **Dashboard** `/admin/dashboard`
3. Tabela, busca, filtros, contagem por tamanho, exportar CSV

## Segurança (firestore.rules)

- Aluno: lê/edita apenas `users/{seuUid}` e `uniformes/{seuUid}`
- Admin: lê lista de todos `users` e `uniformes`
- Rotas React bloqueiam acesso sem login (`ProtectedRoute`)

## Estrutura do código

```
src/firebase/firebase.js     ← CONFIG + auth + db
src/services/authService.js  ← login, cadastro, logout, recuperar senha
src/services/firestoreService.js ← users + uniformes
src/context/AuthContext.jsx  ← sessão persistente
src/pages/admin/AdminDashboard.jsx
firestore.rules
```

## Build

```bash
npm run build
npm run preview
```

## Solução de problemas

| Erro | Ação |
|------|------|
| `permission-denied` | Publique `firestore.rules` no console |
| Admin não entra no dashboard | Crie `admin@unicontrol.com` no Authentication |
| Matrícula duplicada | Mensagem automática — use outra matrícula |
