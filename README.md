# Instastalk

Stalker removal tool for Instagram: remove followers you don't follow back.

## Instructions

First of all make your Instagram account private, then:

1. Set your username and password as environment variables and create a directory to store the data:

```console
export IG_USERNAME=your_username
export IG_PASSWORD=your_password
mkdir /tmp/data
```

2. Optionally specify a proxy:

```console
export IG_PROXY=https://...
```

3. Run the container:

```console
docker run -e IG_USERNAME -e IG_PASSWORD -v /tmp/data:/data -it ghcr.io/0x77dev/instastalk:latest
```

4. Wait for the script to finish, then check the `/tmp/data/result.json` directory for the removed followers list.
