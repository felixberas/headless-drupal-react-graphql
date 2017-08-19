ARG BUILDER_IMAGE
FROM ${BUILDER_IMAGE:-builder} as builder

FROM amazeeio/centos7-php-drupal:7.0

COPY --from=builder /app /app