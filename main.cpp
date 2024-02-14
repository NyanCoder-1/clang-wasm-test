extern "C" {
	int main();
	void print(const char* message);
}

int main() {
	print("Hello from WebAssembly!");
	return 0;
}