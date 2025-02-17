import { createLoader, parseAsBoolean } from 'nuqs/server'

export const passKeySearchParams = {
  isPassKey: parseAsBoolean.withDefault(false),
}

export const loadPassKeySearchParams = createLoader(passKeySearchParams)
