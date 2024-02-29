# buycoin v2

Configure docker to up container.

## Getting Started

1. first you need install npm in frontend folder
```shell
npm install
```

2. use build scripts in root project directory. Example:
```shell
./local_recreate_docker.sh
```

3. That's all use you local domain for project

### Prerequisities

In order to run this container you'll need docker installed.

* [Windows](https://docs.docker.com/windows/started)
* [OS X](https://docs.docker.com/mac/started/)
* [Linux](https://docs.docker.com/linux/started/)

### Usage

Build container in `local` version in the background

```shell
docker-compose -f docker-compose.yaml -f docker-compose.local.yaml up --build -d
```

Build container in `development` version in the background

```shell
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up --build -d
```

Build container in `production` version in the background

```shell
docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up --build -d
```

Stop, delete all containers and recreate this in `local` version

```shell
./local_recreate_docker.sh
```

Stop, delete all containers and recreate this in `development` version

```shell
./dev_recreate_docker.sh
```

Stop, delete all containers and recreate this in `production` version

```shell
./prod_recreate_docker.sh
```

### Only one container REBUILD - USAGE EXAMPLES

Rebuild only `frontend` layer for `local` environment

```shell
./one_container_rebuild.sh -container frontend -environment local
```

Rebuild only `nginx` layer for `dev` environment

```shell
./one_container_rebuild.sh -container nginx -environment dev
```
It works for layers ( api / frontend / nginx )


Configure file `hosts` to start container in local domain

```text
# local domains for production and development
127.0.0.1 buycoin.dev.cash
# etc...
```

#### Symfony .env.local configuration

Database configuration

```text
DATABASE_URL=mysql://buycoin-user:UdUYFv8AERNwr4tK@172.22.0.8:3306/buycoin?serverVersion=5.7
```

RabbitMQ configuration

```text
MESSENGER_TRANSPORT_DSN=amqp://buycoin-rabbitmq-user:yECrrehD6yU9nwzM@172.22.0.6:5672/%2f/messages
```

SMTP configuration
```text
MAILER_DSN=smtp://172.22.0.5:1025
```

#### In browser

Mailcatcher and PhpMyAdmin only work in `development` version, RabbitMQ in both. Don't forget to start container.

* [Mailcatcher](http://172.22.0.5:1080)
* [PhpMyAdmin](http://buycoin.dev.cash:8080)
* [Mongo Express](http://buycoin.dev.cash:8085)
* [RabbitMQ](http://localhost:15672)

Monitoring tools

* [Grafana](http://buycoin.dev.cash:8082)
* [Prometeus](http://buycoin.dev.cash:8086)


#### Grafana configuration

Go to http://buycoin.dev.cash:8082

1. Add "Data sources" (Prometheus + MySQL) in `Configuration / Data sources`

  - Prometheus
      `http://172.22.0.4:9090`
      `Server`
       Import additional plugins in header tab `Dashboards` (Prometheus Stats / Prometheus 2.0 Stats / Grafana metrics )
  - MySQL 172.22.0.8:3306 (root/root - database mysql)

2. Choose any Dashboard from `Dasboards / Manage`

Go to http://buycoin.dev.cash:8086 to get list all posible metrics to use in grafana

3. Profit!
