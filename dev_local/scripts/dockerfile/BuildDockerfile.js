const fs = require('fs');
const path = require('path');
const LoadHelmValues = require('./../lib/LoadHelmValues.js')

let main = async function () {
  let config = await LoadHelmValues()

  let fileContent = fs.readFileSync(path.join(config.dev_local.projectBasePath, '/config/Dockerfile'), 'utf8')
  
  let entrypoint = fs.readFileSync(path.join(config.dev_local.projectBasePath, 'dev_local/asset/Dockerfile/entrypoint.sh'), 'utf8')
  entrypoint += `
${config.app.Dockerfile.CMD}`

  fs.writeFileSync(path.join(config.dev_local.projectBasePath, 'tmp/dev_local/yml/entrypoint.sh'), entrypoint, 'utf8')

  //fileContent += '\n\n' + entrypoint
  fileContent += `

# ----------------------------------------------------------------
# SSH

RUN apt-get update || echo "apt-get update failed"
RUN apt-get install -y openssh-server
RUN systemctl enable ssh
RUN echo "PermitRootLogin yes" >> /etc/ssh/sshd_config
#RUN useradd user

# ----------------------------------------------------------------
# 中文

#RUN apt-get install -y \
#    fonts-noto-cjk
#RUN apt-get install -y \
#    locales

#RUN sed -ie 's/# zh_TW.UTF-8 UTF-8/zh_TW.UTF-8 UTF-8/g' /etc/locale.gen
#RUN sed -ie 's/# zh_CN.UTF-8 UTF-8/zh_CN.UTF-8 UTF-8/g' /etc/locale.gen
#RUN locale-gen zh_TW.UTF-8  
#ENV LC_ALL=zh_TW.UTF-8
#ENV DEBIAN_FRONTEND=noninteractive
#ENV LANG=zh_TW.UTF-8

# ----------------------------------------------------------------
# customized entrypoint
  
COPY ./tmp/dev_local/yml/entrypoint.sh /paas_app/entrypoint.sh
RUN chmod 777 /paas_app/entrypoint.sh
CMD ["sh", "/paas_app/entrypoint.sh"]`

  fs.writeFileSync(path.join(config.dev_local.projectBasePath, 'tmp/dev_local/yml/Dockerfile'), fileContent, 'utf8')
}

module.exports = main