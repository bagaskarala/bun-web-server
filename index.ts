import figlet from "figlet";

const server = Bun.serve({
    async fetch(req) {
        const url = new URL(req.url);

        if (url.pathname === "/404") return new Response(JSON.stringify({
            error: 404,
            message: 'Not Found'
        }), {
            status: 404
        });
        if (url.pathname === "/error") {
            throw new Error('whopps!');
        };

        const userId = url.pathname.replace(/^\//, '');
        const res = await fetch(`${process.env.API_URL}/users/${userId}`);
        const json = await res.json();

        const body = figlet.textSync(json.name ?? 'Not found');
        return new Response(body);
    },
    error(error) {
        return new Response(`<pre>${error}\n${error.stack}</pre>`, {
            headers: {
                "Content-Type": "text/html",
            },
        });
    },
    port: 3000,
});

console.log(`Listening on http://localhost:${server.port} ...`);
