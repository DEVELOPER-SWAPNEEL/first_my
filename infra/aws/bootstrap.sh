#!/usr/bin/env bash
# AI-assisted host preparation only. No checkout, credentials, application or public listener.
set -euo pipefail
umask 077
exec > >(tee -a /var/log/launchops-bootstrap.log) 2>&1
export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y ca-certificates curl snapd
install -m 0755 -d /etc/apt/keyrings
curl --fail --silent --show-error https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
. /etc/os-release
cat > /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: ${UBUNTU_CODENAME:-$VERSION_CODENAME}
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker

# AWS officially supports its Snap CLI package; Ubuntu AWS images carry SSM as a Snap.
# Bootstrap packages track stable channels; image/software freezing is a later external gate.
if ! snap list aws-cli >/dev/null 2>&1; then snap install aws-cli --classic; fi
ln -sf /snap/bin/aws /usr/local/bin/aws
if ! snap list amazon-ssm-agent >/dev/null 2>&1; then snap install amazon-ssm-agent --classic; fi
snap start amazon-ssm-agent

install -m 0700 -d /opt/launchops /opt/launchops/shared /opt/launchops/releases
docker compose version
aws --version
touch /opt/launchops/shared/bootstrap-complete
printf '%s\n' 'Host prepared; install a private runtime .env before an authorized deployment.'
