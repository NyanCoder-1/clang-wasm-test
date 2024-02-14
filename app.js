function make_environment(env) {
	return new Proxy(env, {
		get(target, prop, receiver) {
			if (env[prop] !== undefined) {
				return env[prop].bind(env);
			}
			return (...args) => {
				throw new Error(`NOT IMPLEMENTED: ${prop} ${args}`);
			}
		}
	});
}

class App {
	constructor() {
		this.wasm = undefined;
	}

	async start() {
		if (this.wasm !== undefined) {
			console.error("The application is already running. Please stop() it first.");
			return;
		}

		this.wasm = await WebAssembly.instantiateStreaming(fetch("wasm/app.wasm"), {
			env: make_environment(this)
		});

		this.wasm.instance.exports.main();
	}

	print(pMessage) {
		const buffer = this.wasm.instance.exports.memory.buffer;
		console.log(cstr_by_ptr(buffer, pMessage));
	}
}

function cstrlen(mem, ptr) {
	let len = 0;
	while (mem[ptr] != 0) {
		len++;
		ptr++;
	}
	return len;
}

function cstr_by_ptr(mem_buffer, ptr) {
	const mem = new Uint8Array(mem_buffer);
	const len = cstrlen(mem, ptr);
	const bytes = new Uint8Array(mem_buffer, ptr, len);
	return new TextDecoder().decode(bytes);
}
