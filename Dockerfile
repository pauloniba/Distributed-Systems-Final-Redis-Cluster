FROM redis:7.2

RUN mkdir -p /redis-data
VOLUME /redis-data

EXPOSE 6379 16379

CMD ["redis-server"]

