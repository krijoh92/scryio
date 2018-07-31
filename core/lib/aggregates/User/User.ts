import {EventWithMetadata, KeySchema, retryCommand} from '@ddes/core'
import config from 'config'
import {addSeconds, isFuture} from 'date-fns'
import ImmutableAggregate from 'lib/ImmutableAggregate'
import {validate} from 'lib/joi'
import {sign, verify} from 'lib/jwtHelper'
import {encryptPassword, validatePassord} from 'lib/passwordHelper'
import {padStart} from 'lodash'
import uuid from 'uuid/v4'
import reducer from './reducer'
import * as schema from './schema'

class User extends ImmutableAggregate {
  public static stateReducer = reducer
  public static keySchema = new KeySchema(['username'])

  @validate(schema.create)
  @retryCommand()
  public async create(props: {
    username: string;
    email: string;
    password: string;
    committer?: string;
  }) {
    const encrypted = encryptPassword(props.password)
    return await this.commit({
      type: 'Created',
      properties: {
        committer: 'system',
        ...props,
        password: encrypted
      },
    })
  }

  @validate(schema.update)
  @retryCommand()
  public async update(props: {
    email: string;
    password: string;
    committer?: string;
  }) {
    return await this.commit({
      type: 'Updated',
      properties: {
        committer: 'system',
        ...props,
      },
    })
  }

  @retryCommand()
  public async generateAccessToken(refreshToken: string, requestHeaders: any) {
    const decodedRefreshToken = verify(refreshToken)

    if (decodedRefreshToken.tokenType !== 'refresh') {
      throw new Error('Refresh token is needed for this operation')
    }

    if (
      new Date(decodedRefreshToken.iat * 1000) <=
      new Date(this.state.tokensInvalidatedTimestamp)
    ) {
      await this.commit({
        type: 'GenerateAccessTokenFailedWithInvalidatedRefreshToken',
        properties: {
          refreshToken,
          requestHeaders,
        },
      })

      throw new Error('Invalidated refresh token')
    }

    const {username} = this.state
    const payload = {username}

    const accessToken = sign({
      tokenType: 'access',
      ...payload,
    })

    return await this.commit({
      type: 'AccessTokenGenerated',
      properties: {
        requestHeaders,
        accessToken,
        refreshToken,
      },
    })
  }

  @retryCommand()
  public async generateRefreshToken(password: string, requestHeaders?: any) {
    if (
      this.generateRefreshTokenFailuresWithinInterval.length >=
      config.get('auth.maxGenerateRefreshTokenFailuresPerInterval')
    ) {
      throw new Error('Too many failed generateRefreshToken attempts')
    }

    const passwordIsValid = this.isPasswordValid(password)

    if (!passwordIsValid) {
      await this.commit({
        type: 'GenerateRefreshTokenFailed',
        password,
        requestHeaders,
      })

      throw new Error('Invalid password')
    }

    const refreshToken = sign({
      tokenType: 'refresh',
      username: this.state.username,
    })

    return await this.commit({
      type: 'RefreshTokenGenerated',
      properties: {refreshToken, requestHeaders},
    })
  }

  @retryCommand()
  public async invalidateRefreshTokens() {
    return await this.commit({type: 'RefreshTokensInvalidated'})
  }

  // AUTHENTICATION
  public isPasswordValid(password) {
    return validatePassord(password, this.state.password)
  }

  get generateRefreshTokenFailuresWithinInterval() {
    return this.state.generateRefreshTokenFailures.filter(({timestamp}) =>
      isFuture(
        addSeconds(
          timestamp,
          config.get('auth.maxGenerateRefreshTokenFailuresIntervalInSeconds')
        )
      )
    )
  }
}

export default User
