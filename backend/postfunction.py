import psycopg2

class postfunction:
    def __init__(self):
        self.thing = 1
    
    def postScore(self, Name, Score, Phone):
        conn = psycopg2.connect(
            database='pure-lamb-1277.Scoreboard',
            user='jacob',
            password='testpassword',
            port=26257,
            host='free-tier.gcp-us-central1.cockroachlabs.cloud'
        )

        # Add the new score to the leaderboard and return the current place.
        with conn.cursor() as cur:
            cur.execute("INSERT INTO Scoreboard.Scores (Name, Score, Phone) VALUES ('" + Name + "', " + Score + ", " + Phone + ") RETURNING *;")
            conn.commit()
            rowID = cur.fetchone()[3]

            cur.execute("SELECT * FROM Scoreboard.Scores ORDER BY Score DESC;")
            rows = cur.fetchall()
            currRow = 0
            currPlace = 0
            for row in rows:
                currRow += 1
                if (row[3] == rowID):
                    currPlace = currRow
                    break
        
        conn.close()

        return {"Place": currPlace}      