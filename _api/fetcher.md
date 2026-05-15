FLUJO DEL FETCHER

fetch() → 401 → ¿alguien ya está refreshing?
                    NO  → refresh token → ok → processQueue() → reintento
                                              → fallo → processQueue(error) → /login
                    SÍ  → esperar en cola → reintento cuando se resuelva
         → ok  → parsear respuesta → return data
         → error de red → throw NETWORK_SERVER_ERROR