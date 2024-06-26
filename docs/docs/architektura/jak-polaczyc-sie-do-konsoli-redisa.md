# Jak połączyć się do konsoli redisa

Wykonaj komendy:

```bash
apt-get update
```

```bash
apt-get install redis-tools
```

```bash
redis-cli -h redis
```


Usuwanie wszystkich kluczy z bazy danych:
```bash
redis:6379> flushall
```
