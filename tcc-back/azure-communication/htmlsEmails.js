/***********************************************
 * Objetivo: Arquivo de responsavel pela construção do html presente no sistema de email
 * Autor: Gustavo de Paula Silva
 * Data: 14/05/2026
 * Versão: 1.0
 ************************************************/

const joinFamilyHTML = function(to_email, dono_familia, token){
    const router = ``;
    const url = `https://gustavodepaula14.github.io/pagina-login-usuarioFamilia?token=${token}`;

    let html = `<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Convite para Família</title>
    <style>
      .btn-convite:hover {
        background-color: #e05700 !important;
      }
    </style>
  </head>
  <body style="padding: 0; margin: 0; background-color: #ffffff; font-family: sans-serif;">
    
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 50px;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="text-align: center;">
            
            <tr>
              <td align="center" style="padding-bottom: 20px;">
                <svg width="340" height="100" viewBox="0 0 1222 300" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <rect width="1222" height="300" fill="url(#pattern0_1109_51)" />
                  <defs>
                    <pattern id="pattern0_1109_51" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlink:href="#image0_1109_51" transform="matrix(0.00101446 0 0 0.00413223 -0.0234611 0)" />
                    </pattern>
                    <image id="image0_1109_51" width="1032" height="242" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAgAAADyCAYAAADA3/d2AAAQAElEQVR4Aex9B6ClRXn288585dTb792+9L6Air2iogZjRRfBElOM0HUoxwAAAAZJREFUAwDuUnwkUHN1kAAAAABJRU5ErkJggg==" />
                  </defs>
                </svg>
              </td>
            </tr>
            <h2 style="color: #ff6200; font-size: 60px;">FamilySync<h2/>

            <tr>
              <td>
                <h1 style="color: #ff6200; margin: 10px 0; font-weight: bold;">Você recebeu um convite!</h1>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 30px 30px 30px;">
                <h4 style="color: #662700; font-weight: bold; line-height: 1.5; margin: 0;">
                  ${dono_familia} quer te adicionar à dele! Junte-se para compartilhar listas, organizar a rotina e manter todos conectados.
                </h4>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding-bottom: 60px;">
                <a href="${url}" target="_blank" class="btn-convite" style="
                  display: inline-block;
                  height: 50px;
                  line-height: 50px;
                  width: 200px;
                  background-color: #ff6200;
                  color: #ffffff;
                  font-weight: bold;
                  font-size: 20px;
                  text-decoration: none;
                  border-radius: 4px;
                  text-align: center;
                  transition: 0.2s;
                ">
                  Aceitar Convite
                </a>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>

    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ff6200; color: #ffffff;">
      <tr>
        <td align="center" style="padding: 30px 20px;">
          <h3 style="font-size: 12px; font-weight: bold; margin: 0 0 15px 0; max-width: 500px; line-height: 1.4;">
            Se você não conhece ${dono_familia} ou não esperava este convite, pode ignorar este e-mail com segurança.
          </h3>
          <table width="80%" border="0" cellspacing="0" cellpadding="0" style="border-top: 2px solid #ffffff;">
            <tr>
              <td align="center" style="padding-top: 15px;">
                <h5 style="font-size: 11px; margin: 0; font-weight: bold;">
                  © 2026 FamilySync. Todos os direitos reservados.
                </h5>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

  </body>
</html>`;
    return html;
}

const newPasswordHTML = function(code){
    let html = `<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Redefinição de Senha - FamilySync</title>
    <style>
      .btn-site:hover {
        background-color: #e05700 !important;
      }
    </style>
  </head>
  <body
    style="
      padding: 0;
      margin: 0;
      background-color: #ffffff;
      font-family: sans-serif;
    "
  >
    <table
      width="100%"
      border="0"
      cellspacing="0"
      cellpadding="0"
      style="margin-top: 50px"
    >
      <tr>
        <td align="center">
          <table
            width="600"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="text-align: center"
          >
            <tr>
              <td align="center" style="padding-bottom: 10px">
                <h1
                  style="
                    color: #ff6200;
                    font-size: 50px;
                    margin: 0;
                    font-weight: bold;
                  "
                >
                  FamilySync
                </h1>
              </td>
            </tr>

            <tr>
              <td>
                <h2
                  style="
                    color: #ff6200;
                    margin: 10px 0 25px 0;
                    font-weight: bold;
                    font-size: 26px;
                  "
                >
                  Redefinição de senha solicitada
                </h2>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 40px 30px 40px">
                <p
                  style="
                    color: #662700;
                    font-weight: bold;
                    font-size: 15px;
                    line-height: 1.6;
                    margin: 0;
                  "
                >
                  Foi solicitada uma redefinição de senha para a conta
                  FamilySync associada a este endereço de e-mail.<br /><br />
                  Para redefinir sua senha, use o código abaixo no site. Se você
                  não solicitou essa redefinição, pode ignorar este e-mail com
                  segurança.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding-bottom: 20px">
                <table
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  style="margin: 0 auto"
                >
                  <tr style="border: 2px solid #ff6200">
                    <td
                      align="center"
                      style="
                        padding: 10px 20px;
                        font-size: 32px;
                        color: #ff6200;
                        font-weight: bold;
                        letter-spacing: 8px;
                        background-color: #ff62004d;
                      "
                    >
                      ${code}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding-bottom: 60px">
                <table
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  style="margin: 0 auto"
                >
                  <tr>
                    <td align="center" bgcolor="#ff6200">
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table
      width="100%"
      border="0"
      cellspacing="0"
      cellpadding="0"
      style="background-color: #ff6200; color: #ffffff"
    >
      <tr>
        <td align="center" style="padding: 30px 20px">
          <table
            width="80%"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="border-top: 1px solid #ffffff"
          >
            <tr>
              <td align="center" style="padding-top: 20px">
                <p style="font-size: 12px; margin: 0; font-weight: bold">
                  © 2026 FamilySync. Todos os direitos reservados.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
    return html;
}

module.exports = {
    joinFamilyHTML,
    newPasswordHTML
};