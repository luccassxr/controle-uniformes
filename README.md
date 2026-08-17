# UNICONTROL

Sistema de gestão de uniformes escolares usando **React + Vite + Firebase Authentication + Firestore**.

Projeto Firebase atual: **unicontrol-1d0d6**

## Rodar no Chromebook

Pré-requisitos:

- Chromebook com ambiente Linux ativado
- Node.js e npm instalados
- Internet para acessar o Firebase

Na pasta do projeto:

```bash
npm install
npm run dev
```

O Vite está configurado para aceitar conexões da rede local. O terminal mostrará algo parecido com:

```text
Local:   http://localhost:5173/
Network: http://192.168.x.x:5173/
```

- No Chromebook, abra o endereço `Local`.
- Em outros dispositivos na mesma rede, use o endereço `Network`.

Se estiver levando o projeto em um pen drive, copie a pasta para **Arquivos Linux** antes de executar os comandos. Isso evita problemas de permissão/acesso do Linux do ChromeOS ao armazenamento removível.

## Firebase

A configuração está em:

```text
src/firebase/firebase.js
```

O projeto usa:

- Firebase Authentication (E-mail/Senha)
- Cloud Firestore

### Administrador

O e-mail reservado para administrador é:

```text
admin@unicontrol.com
```

Crie esse usuário manualmente no Firebase Authentication e escolha uma senha forte. Não existe senha padrão salva no código.

### Firestore

Publique no Firebase Console o conteúdo do arquivo:

```text
firestore.rules
```

As regras impedem que alunos promovam a própria conta para administrador e restringem o acesso aos dados de cada usuário.

## Coleções

| Coleção | Documento | Campos principais |
|---|---|---|
| `users` | `{uid}` | uid, nome, email, role, matricula, serie, turno |
| `uniformes` | `{uid}` | userId, camiseta, jaqueta, calca, bermuda, shortSaia, tenis, atualizadoEm |
| `matriculas` | `{matricula}` | uid |

## Fluxo do aluno

1. Cria a conta.
2. Faz login.
3. Preenche nome, matrícula, turno e série.
4. Escolhe os tamanhos das peças.
5. Os dados são gravados no Firestore.

## Fluxo do administrador

1. Login com `admin@unicontrol.com`.
2. Acesso automático ao dashboard.
3. Visualização de alunos e tamanhos.
4. Filtros por turno e série.
5. Exportação CSV.

## Comandos úteis

```bash
npm run dev
npm run build
npm run preview
```

## Antes da apresentação

Faça estes testes no Chromebook:

1. `npm install`
2. `npm run dev`
3. Abrir `http://localhost:5173`
4. Fazer login como aluno
5. Salvar um tamanho de uniforme
6. Fazer login como administrador
7. Confirmar que o aluno aparece no dashboard
8. Confirmar que o Chromebook tem acesso à internet

## Solução de problemas

| Problema | Ação |
|---|---|
| `permission-denied` | Publique a versão atual de `firestore.rules` no Firebase Console |
| Admin não abre o dashboard | Confirme que `admin@unicontrol.com` existe no Authentication |
| Site abre só no Chromebook | Use o endereço `Network` mostrado pelo Vite nos outros aparelhos |
| `npm: command not found` | Instale Node.js/npm no ambiente Linux do Chromebook |
| Firebase não conecta | Verifique a internet e se o projeto `unicontrol-1d0d6` está ativo |
