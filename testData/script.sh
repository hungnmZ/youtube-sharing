docker cp testData/resources.bson.gz youtube-sharing-mongo-1:/tmp/
docker cp testData/resources.metadata.json.gz youtube-sharing-mongo-1:/tmp/

docker exec youtube-sharing-mongo-1 sh -c "gunzip /tmp/resources.bson.gz"
docker exec youtube-sharing-mongo-1 sh -c "gunzip /tmp/resources.metadata.json.gz"

docker exec youtube-sharing-mongo-1 mongorestore --db test --collection resources --restoreDbUsersAndRoles /tmp/resources.bson


