from db import get_db_connection

def get_user_health_context(auth0_id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT doctor_name, hospital_name, visit_date,
               diagnosis, doctor_suggestion,
               prescribed_medicines, special_notes
        FROM health_records
        WHERE auth0_id = %s
        ORDER BY visit_date DESC
        """,
        (auth0_id,)
    )

    rows = cur.fetchall()
    cur.close()
    conn.close()

    if not rows:
        return "No prior health records available."

    context_lines = []
    for r in rows:
        context_lines.append(
            f"""
Visit Date: {r[2]}
Doctor: {r[0]} at {r[1]}
Diagnosis: {r[3]}
Medicines: {r[5]}
Doctor Advice: {r[4]}
Notes: {r[6]}
""".strip()
        )

    return "\n---\n".join(context_lines)
