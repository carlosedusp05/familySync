const express = require('express');
const cors = require('cors');
const knex = require('knex');

const app = express();
const PORT = 3000;
const URL_BASE = '/v1/familysync'

const routerUsuario = require('./routes/usuario/route_usuario.js')
const routerFamilia = require('./routes/familia/route_familia.js')
const routerInformacao = require('./routes/informacao/router_informacao.js')
const routerEndereco = require('./routes/endereco/router_endereco.js')
const routerItem = require('./routes/item/route_item.js')
const routerLista = require('./routes/lista/route_lista.js')
const routerFinancias = require('./routes/financias/router_financas.js')
const routerLogin = require('./routes/login/router_login.js')
const routerEvento = require('./routes/evento/route_evento.js')
const routerNotificacao = require('./routes/notificacao/router_notificacao.js')
const routerUsuarioInformacao = require('./routes/usuario/route_usuario_informacao.js')
const routeUsuarioFamilia = require('./routes/usuario/route_usuario_familia.js')
const routeUsuarioNotificacao = require('./routes/usuario/route_usuario_notificacao.js')
const routerPermissao = require('./routes/permissao/route_permissao.js')

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend FamilySync rodando');
});

app.get('/teste-banco', async (req, res) => {
  try {
    await db.raw('SELECT 1');
    res.json({ message: 'Conexão com MySQL OK' });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao conectar no banco',
      error: error.message
    });
  }
});

app.use(URL_BASE, routerUsuario);
app.use(URL_BASE, routerFamilia);
app.use(URL_BASE, routerInformacao);
app.use(URL_BASE, routerEndereco);
app.use(URL_BASE, routerItem);
app.use(URL_BASE, routerLista);
app.use(URL_BASE, routerFinancias);
app.use(URL_BASE, routerEvento);
app.use(URL_BASE, routerLogin);
app.use(URL_BASE, routerNotificacao);
app.use(URL_BASE, routerUsuarioInformacao)
app.use(URL_BASE, routeUsuarioFamilia)
app.use(URL_BASE, routeUsuarioNotificacao)
app.use(URL_BASE, routerPermissao);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});