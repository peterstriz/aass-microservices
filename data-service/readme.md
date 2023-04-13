## Start hasura docker

```
docker compose up -d
```

http://localhost:8080

## Import/export metadata

http://localhost:8080/console/settings/metadata-actions

### Export

Hasura metadata

```sh
curl http://localhost:8080/v1/metadata -o metadata/hasura_metadata.json -d"{\"type\": \"export_metadata\", \"args\": {}}"
```

Database

```sh
curl --location --request POST "http://localhost:8080/v1alpha1/pg_dump" --header "Content-Type: application/json" --data-raw "{ \"opts\": [\"-O\", \"-x\", \"--schema\", \"public\", \"--schema\", \"auth\"], \"clean_output\": true, \"source\": \"aass\"}" -o metadata/database.sql
```

## Update database run in windows

```shell
docker cp C:/Projekty/AASS/aass-microservices/data-service/metadata/database.sql data-service-postgres-1:database.sql
```
## Update database run in docker container
```bash
psql postgres://postgres:postgrespassword@postgres:5432/postgres < database.sql

```
