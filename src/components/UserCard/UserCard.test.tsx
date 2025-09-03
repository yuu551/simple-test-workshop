import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { UserCard } from './UserCard'

describe('UserCard', () => {
  test('必須の情報が表示される', () => {
    render(
      <UserCard
        name="田中太郎"
        email="tanaka@example.com"
      />
    )

    expect(screen.getByTestId('user-name')).toHaveTextContent('田中太郎')
    expect(screen.getByTestId('user-email')).toHaveTextContent('tanaka@example.com')
  })

  test('年齢が提供された場合に表示される', () => {
    render(
      <UserCard
        name="佐藤花子"
        email="sato@example.com"
        age={28}
      />
    )

    expect(screen.getByTestId('user-age')).toHaveTextContent('28歳')
  })

  test('年齢が提供されない場合は表示されない', () => {
    render(
      <UserCard
        name="山田次郎"
        email="yamada@example.com"
      />
    )

    expect(screen.queryByTestId('user-age')).not.toBeInTheDocument()
  })

  test('役職が提供された場合に表示される', () => {
    render(
      <UserCard
        name="鈴木三郎"
        email="suzuki@example.com"
        role="フロントエンド開発者"
      />
    )

    expect(screen.getByTestId('user-role')).toHaveTextContent('フロントエンド開発者')
  })

  test('役職が提供されない場合は表示されない', () => {
    render(
      <UserCard
        name="高橋四郎"
        email="takahashi@example.com"
      />
    )

    expect(screen.queryByTestId('user-role')).not.toBeInTheDocument()
  })

  test('アバター画像が提供された場合に表示される', () => {
    render(
      <UserCard
        name="渡辺五郎"
        email="watanabe@example.com"
        avatarUrl="https://example.com/avatar.jpg"
      />
    )

    const avatarImg = screen.getByAltText('渡辺五郎のアバター')
    expect(avatarImg).toBeInTheDocument()
    expect(avatarImg).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  test('アバター画像がない場合はプレースホルダーが表示される', () => {
    render(
      <UserCard
        name="伊藤六郎"
        email="ito@example.com"
      />
    )

    expect(screen.getByTestId('avatar-placeholder')).toHaveTextContent('伊')
    expect(screen.queryByAltText('伊藤六郎のアバター')).not.toBeInTheDocument()
  })

  test('オンライン状態の場合にインジケーターが表示される', () => {
    render(
      <UserCard
        name="加藤七郎"
        email="kato@example.com"
        isOnline={true}
      />
    )

    expect(screen.getByTestId('online-indicator')).toBeInTheDocument()
  })

  test('オフライン状態の場合にインジケーターが表示されない', () => {
    render(
      <UserCard
        name="小林八郎"
        email="kobayashi@example.com"
        isOnline={false}
      />
    )

    expect(screen.queryByTestId('online-indicator')).not.toBeInTheDocument()
  })

  test('isOnlineが未指定の場合はオフラインとして扱われる', () => {
    render(
      <UserCard
        name="吉田九郎"
        email="yoshida@example.com"
      />
    )

    expect(screen.queryByTestId('online-indicator')).not.toBeInTheDocument()
  })

  test('プレースホルダーアバターは名前の最初の文字を大文字で表示する', () => {
    render(
      <UserCard
        name="nakamura"
        email="nakamura@example.com"
      />
    )

    expect(screen.getByTestId('avatar-placeholder')).toHaveTextContent('N')
  })

  test('全ての情報が提供された場合にすべて表示される', () => {
    render(
      <UserCard
        name="森田十郎"
        email="morita@example.com"
        age={35}
        role="プロダクトマネージャー"
        avatarUrl="https://example.com/morita.jpg"
        isOnline={true}
      />
    )

    expect(screen.getByTestId('user-name')).toHaveTextContent('森田十郎')
    expect(screen.getByTestId('user-email')).toHaveTextContent('morita@example.com')
    expect(screen.getByTestId('user-age')).toHaveTextContent('35歳')
    expect(screen.getByTestId('user-role')).toHaveTextContent('プロダクトマネージャー')
    expect(screen.getByAltText('森田十郎のアバター')).toBeInTheDocument()
    expect(screen.getByTestId('online-indicator')).toBeInTheDocument()
  })
})