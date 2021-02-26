db.createUser(
    {
        user: 'MONGO_USER_NAME',
        pwd: "MONGO_USER_PASSWORD",
        roles: [
            {
                role: "readWrite",
                db: "MONGO_INITDB_DATABASE"
            }
        ]
    }
);
