import { Logger } from '@nestjs/common';
import { AxiosError } from 'axios';

export const logAxiosError = (logger: Logger, error: AxiosError) => {
  logger.error(
    `Request to ${error.config.baseURL}${
      error.config.url
    } failed with status code ${
      error.response.status
    }. Details: ${JSON.stringify(error.response.data)}`,
  );
};
