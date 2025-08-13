/**
 * ユーザーストーリー定義
 * プロダクトオーナーが記述したシナリオをテスト可能な形式で定義
 */

export interface UserStory {
  id: string;
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: AcceptanceCriterion[];
  scenarios: Scenario[];
}

export interface AcceptanceCriterion {
  id: string;
  description: string;
  required: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  given: string[];
  when: string[];
  then: string[];
  type: 'happy' | 'error' | 'edge';
}

export const contactFormStories: UserStory[] = [
  {
    id: 'US-001',
    title: '問い合わせフォームから連絡を送信する',
    asA: 'Webサイトの訪問者',
    iWant: '問い合わせフォームから連絡を送信したい',
    soThat: 'サービスについて質問や相談ができる',
    acceptanceCriteria: [
      {
        id: 'AC-001-1',
        description: '名前、メールアドレス、件名、本文が入力できる',
        required: true
      },
      {
        id: 'AC-001-2',
        description: '必須項目が未入力の場合、エラーメッセージが表示される',
        required: true
      },
      {
        id: 'AC-001-3',
        description: 'メールアドレスの形式が不正な場合、エラーメッセージが表示される',
        required: true
      },
      {
        id: 'AC-001-4',
        description: '送信成功時に確認メッセージが表示される',
        required: true
      }
    ],
    scenarios: [
      {
        id: 'SC-001-1',
        title: '正常な問い合わせ送信',
        type: 'happy',
        given: ['問い合わせフォームページを開いている'],
        when: [
          '名前に「田中太郎」を入力する',
          'メールアドレスに「tanaka@example.com」を入力する',
          '件名に「サービスについて」を入力する',
          '本文に「詳細を教えてください」を入力する',
          '送信ボタンをクリックする'
        ],
        then: [
          '「お問い合わせを受け付けました」というメッセージが表示される',
          'フォームがクリアされる'
        ]
      },
      {
        id: 'SC-001-2',
        title: '必須項目未入力でのエラー',
        type: 'error',
        given: ['問い合わせフォームページを開いている'],
        when: [
          '名前を入力せずに',
          '送信ボタンをクリックする'
        ],
        then: [
          '「名前は必須項目です」というエラーメッセージが表示される',
          'フォームは送信されない'
        ]
      },
      {
        id: 'SC-001-3',
        title: '不正なメールアドレス形式',
        type: 'error',
        given: ['問い合わせフォームページを開いている'],
        when: [
          '名前に「田中太郎」を入力する',
          'メールアドレスに「invalid-email」を入力する',
          '件名に「テスト」を入力する',
          '本文に「テスト」を入力する',
          '送信ボタンをクリックする'
        ],
        then: [
          '「正しいメールアドレスを入力してください」というエラーメッセージが表示される',
          'フォームは送信されない'
        ]
      }
    ]
  },
  {
    id: 'US-002',
    title: '入力内容を確認してから送信する',
    asA: 'Webサイトの訪問者',
    iWant: '送信前に入力内容を確認したい',
    soThat: '誤った内容を送信することを防げる',
    acceptanceCriteria: [
      {
        id: 'AC-002-1',
        description: '確認画面で入力内容が表示される',
        required: true
      },
      {
        id: 'AC-002-2',
        description: '確認画面から編集画面に戻れる',
        required: true
      },
      {
        id: 'AC-002-3',
        description: '確認画面から送信できる',
        required: true
      }
    ],
    scenarios: [
      {
        id: 'SC-002-1',
        title: '確認後の送信',
        type: 'happy',
        given: ['問い合わせフォームページを開いている'],
        when: [
          '全ての項目を正しく入力する',
          '確認ボタンをクリックする',
          '確認画面で内容を確認する',
          '送信ボタンをクリックする'
        ],
        then: [
          '「お問い合わせを受け付けました」というメッセージが表示される'
        ]
      },
      {
        id: 'SC-002-2',
        title: '確認画面から編集に戻る',
        type: 'happy',
        given: ['確認画面を表示している'],
        when: [
          '戻るボタンをクリックする'
        ],
        then: [
          '編集画面に戻る',
          '入力内容が保持されている'
        ]
      }
    ]
  },
  {
    id: 'US-003',
    title: '入力途中の内容を保持する',
    asA: 'Webサイトの訪問者',
    iWant: '入力途中でページを離れても内容を保持したい',
    soThat: '再度入力する手間を省ける',
    acceptanceCriteria: [
      {
        id: 'AC-003-1',
        description: '入力内容がローカルストレージに保存される',
        required: true
      },
      {
        id: 'AC-003-2',
        description: 'ページを再読み込みしても入力内容が復元される',
        required: true
      },
      {
        id: 'AC-003-3',
        description: '送信完了後は保存内容がクリアされる',
        required: true
      }
    ],
    scenarios: [
      {
        id: 'SC-003-1',
        title: '入力内容の自動保存と復元',
        type: 'happy',
        given: ['問い合わせフォームページを開いている'],
        when: [
          '名前に「田中太郎」を入力する',
          'ページを再読み込みする'
        ],
        then: [
          '名前欄に「田中太郎」が表示されている'
        ]
      }
    ]
  }
];