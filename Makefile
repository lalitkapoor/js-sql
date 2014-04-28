.SHELL := /bin/sh

.PHONY: test

test:
	rm -rf build/tests
	mkdir -p build/tests
	bin/jss -x jss test/ build/tests
	mocha build/tests
	rm -rf build/tests

