import psycopg2

class getfunction:
    def __init__(self):
        self.thing = 1
    
    def getScores(self):
        conn = psycopg2.connect(
            database='pure-lamb-1277.Scoreboard',
            user='jacob',
            password='testpassword',
            port=26257,
            host='free-tier.gcp-us-central1.cockroachlabs.cloud'
        )
        
        topTen = [] 

        # Returns the ten highest scores from the database.
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM Scoreboard.Scores ORDER BY Score DESC;")
            rows = cur.fetchall()
            currRow = 0
            for row in rows:
                currRow += 1
                topTen.append({"Name": row[0], "Score": row[1]})
                if currRow == 25:
                    break
        
        conn.close()        
        return topTen       