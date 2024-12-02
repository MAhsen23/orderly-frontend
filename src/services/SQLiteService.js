import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'app.db', location: 'default' });

const SQLiteService = {
    initDB: () => {
        db.transaction(tx => {
            tx.executeSql(`
                CREATE TABLE IF NOT EXISTS user (
                    _id TEXT PRIMARY KEY,
                    name TEXT,
                    email TEXT,
                    isProfileComplete INTEGER,
                    isVerified INTEGER,
                    birthYear INTEGER,
                    averageCycleLength INTEGER,
                    averagePeriodDuration INTEGER,
                    cycleType TEXT
                );
            `);
            tx.executeSql(`
                CREATE TABLE IF NOT EXISTS menstrualCycles (
                    _id TEXT PRIMARY KEY,
                    startDate TEXT,
                    endDate TEXT,
                    duration INTEGER
                );
            `);
            tx.executeSql(`
                CREATE TABLE IF NOT EXISTS notes (
                    content TEXT
                );
            `);
        });
    },

    setUser: (user) => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `INSERT OR REPLACE INTO user (_id, name, email, isProfileComplete, isVerified, birthYear, averageCycleLength, averagePeriodDuration, cycleType) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                    [user._id, user.name, user.email, user.isProfileComplete ? 1 : 0, user.isVerified ? 1 : 0, user.birthYear, user.averageCycleLength, user.averagePeriodDuration, user.cycleType],
                    (_, result) => resolve(result),
                    (_, error) => reject(error)
                );
            });
        });
    },

    getUser: () => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM user LIMIT 1;`,
                    [],
                    (_, { rows }) => {
                        if (rows.length > 0) {
                            const user = rows.item(0);
                            resolve({
                                ...user,
                                isProfileComplete: user.isProfileComplete === 1,
                                isVerified: user.isVerified === 1
                            });
                        } else {
                            resolve(null);
                        }
                    },
                    (_, error) => reject(error)
                );
            });
        });
    },

    updateUser: (updates) => {
        return new Promise((resolve, reject) => {
            const fields = Object.keys(updates);
            const values = Object.values(updates);
            const setClause = fields.map(field => `${field} = ?`).join(', ');

            db.transaction(tx => {
                tx.executeSql(
                    `UPDATE user SET ${setClause};`,
                    [...values],
                    (_, result) => resolve(result),
                    (_, error) => reject(error)
                );
            });
        });
    },

    setNotes: (notes) => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(`DELETE FROM notes;`, [], () => {
                    const insertPromises = notes.map(note => {
                        return new Promise((resolveInsert, rejectInsert) => {
                            tx.executeSql(
                                `INSERT INTO notes (content) VALUES (?);`,
                                [note],
                                (_, result) => resolveInsert(result),
                                (_, error) => rejectInsert(error)
                            );
                        });
                    });
                    Promise.all(insertPromises)
                        .then(() => resolve())
                        .catch(error => reject(error));
                });
            });
        });
    },

    getNotes: () => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM notes;`,
                    [],
                    (_, { rows }) => {
                        const notes = [];
                        for (let i = 0; i < rows.length; i++) {
                            notes.push(rows.item(i).content);
                        }
                        resolve(notes);
                    },
                    (_, error) => reject(error)
                );
            });
        });
    },

    setMenstrualCycles: (cycles) => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(`DELETE FROM menstrualCycles;`, [], () => {
                    const insertPromises = cycles.map(cycle => {
                        return new Promise((resolveInsert, rejectInsert) => {
                            tx.executeSql(
                                `INSERT INTO menstrualCycles (_id, startDate, endDate, duration) VALUES (?, ?, ?, ?);`,
                                [cycle._id, cycle.startDate, cycle.endDate, cycle.duration],
                                (_, result) => resolveInsert(result),
                                (_, error) => rejectInsert(error)
                            );
                        });
                    });
                    Promise.all(insertPromises)
                        .then(() => resolve())
                        .catch(error => reject(error));
                });
            });
        });
    },

    getMenstrualCycles: () => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM menstrualCycles;`,
                    [],
                    (_, { rows }) => {
                        const cycles = [];
                        for (let i = 0; i < rows.length; i++) {
                            cycles.push(rows.item(i));
                        }
                        resolve(cycles);
                    },
                    (_, error) => reject(error)
                );
            });
        });
    },

    clearAllData: () => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(`DELETE FROM user;`);
                tx.executeSql(`DELETE FROM menstrualCycles;`);
                tx.executeSql(`DELETE FROM notes;`);
            }, (error) => {
                reject(error);
            }, () => {
                resolve();
            });
        });
    },
};

export default SQLiteService;