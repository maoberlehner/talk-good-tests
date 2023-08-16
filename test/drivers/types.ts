export type Interactions = {
  check: () => Promise<void>;
  click: () => Promise<void>;
  focus: () => Promise<void>;
  type: (text: string) => Promise<void>;
};

export type Assertions = {
  shouldBeVisible: () => Promise<void>;
  shouldHaveAttribute: (name: string, value?: string | RegExp) => Promise<void>;
};

export type AssertionsNot = {
  shouldNotBeVisible: () => Promise<void>;
  shouldNotExist: () => Promise<void>;
};

type FindByLabelText = (text: string) => Interactions & Assertions;

type Role = `button` | `link` | `option` | `tab`;

type FindByRoleOptions = {
  name: string;
};

type FindByRole = (
  role: Role,
  options: FindByRoleOptions,
) => Interactions & Assertions;

type FindByTestId = (testId: string) => Interactions & Assertions;

type FindByTextOptions = {
  withinTestId?: string;
};

type FindByText = (text: string, options?: FindByTextOptions) => Assertions;

type FindAllByText = (text: string, options?: FindByTextOptions) => Assertions;

type QueryByText = (text: string, options?: FindByTextOptions) => AssertionsNot;

export type GoToOptions = {
  device?: `desktop` | `mobile`;
};

type GoTo = (path: string, options?: GoToOptions) => Promise<void>;

type Body = Record<string | number, unknown>;

type GetBody = ({ searchParams }: { searchParams: URLSearchParams }) => Body;

export type MockEndpoint = (
  endpoint: string,
  options: {
    body: Body | GetBody;
    httpVerb: `get` | `post` | `patch` | `delete`;
    status: number;
  },
) => void;

type PreconditionOptions = {
  localStorage: typeof window.localStorage;
  mockEndpoint: MockEndpoint;
};

export type Precondition = (
  options: PreconditionOptions,
) => void | Promise<void>;

export type Prepare = (precondition: Precondition) => Promise<void>;

export type Driver = {
  findAllByText: FindAllByText;
  findByLabelText: FindByLabelText;
  findByRole: FindByRole;
  findByTestId: FindByTestId;
  findByText: FindByText;
  goTo: GoTo;
  prepare: Prepare;
  queryByText: QueryByText;
};

export type ItCallback = ({
  driver,
}: {
  driver: Driver;
}) => void | Promise<void>;
