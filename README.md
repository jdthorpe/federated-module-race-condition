# Demonstration of a race condition with the Federated Module Plugin with standard chunk IDs

This repo illustrates one of the "gotchas" of working with Federated Modules
in Webpack, which is that **all of your federated module must have a unique
name in their `package.json`**. Otherwise random collisions can occur between
resources in otherwise independent modules.

## Background

Internally, webpack seems to keep track of chunks by their package name +
chunk id, ( and chunk id's are just a hash of their module loaders + file
path). Exposing a common filename (e.g. `src/index.js`) will result in a
common chunk id (e.g. `138.js`), and if two federated modules have the same
name (defined in their `package.json` file), then the underlying resources
will become ambiguous and will be subject to a race condition (depending on
which module's `remoteEntry.js` gets loaded first)

## Demo

In this app, there are two federated modules that expose a `src/index.js` file which are simple enough:

```js
// module_a/src/index.js
export const message = "Hi from Module A"
```

and 

```js
// module_b/src/index.js
export const message = "Hi from Module B"
```

The host app simply imports these and displays the results with: 

```js
function App() {
    const [a, set_a] = useState()
    const [b, set_b] = useState()

    useEffect(() => {
        import(`module_a/Message`).then((m) => { set_a(m.message) })
        import(`module_b/Message`).then((m) => { set_b(m.message) })
    }, [])

    return (
        <>
            <p>Module A says: {a}</p>
            <p>Module B says: {b}</p>
        </>
    )
}
```

When the app is run, the messages read either

```txt
Module A says: Hi from Module A
Module B says: Hi from Module A
```

or:

```txt
Module A says: Hi from Module B
Module B says: Hi from Module B
```

Depending on whether module A or B gets loaded first. (The Nginx server
introduces a random delay to help make the switching behavior more obvious)

## Solution

The solution here is to rename either of the modules in their package.json
files and re-compile the library by calling `npm run build` in their
directory.

## Usage

### Terminal 1: Start the  dev server

```sh
cd federated-module-race-condition/host
yarn
yarn start
```

(close the window that automatically opens on port 3300 by the react dev server)

### Terminal 2: build the federated module

```sh
cd federated-module-race-condition/module_a
yarn
yarn build
cd ../module_b
yarn
yarn build
```

### Terminal 3: Start the NGINX proxy (running in docker -- yes, you'll need docker installed for this...)

**Linus/OSX**:

```sh
cd federated-module-race-condition
docker run \
    --rm -it \
    -p 3100:80 \
    -v $PWD/dev-nginx.conf:/etc/nginx/conf.d/default.conf \
    -v $PWD:/www/containers \
    openresty/openresty
```

**Windows**:

```sh
cd federated-module-race-condition
docker run \
    --rm -it \
    -p 3100:80 \
    -v %CD%/dev-nginx.conf:/etc/nginx/conf.d/default.conf \
    -v %CD%:/www/containers \
    openresty/openresty
```

Finally, open the app on `localhost:3100` (where the NGINX proxy is listening)
