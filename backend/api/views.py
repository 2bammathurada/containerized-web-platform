from django.db import connection, DatabaseError
from django.http import JsonResponse


def health_check(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()

        return JsonResponse(
            {
                "status": "ok",
                "database": "connected",
            }
        )

    except DatabaseError:
        return JsonResponse(
            {
                "status": "error",
                "database": "unavailable",
            },
            status=503,
        )