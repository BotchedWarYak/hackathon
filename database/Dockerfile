FROM clockworklabs/spacetime:latest

# Add wasm32 target
RUN rustup target add wasm32-unknown-unknown

WORKDIR /app/database
COPY . .

RUN spacetime build

CMD ["start", "--bind", "0.0.0.0:3001"]