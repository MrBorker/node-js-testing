import {
  getBankAccount,
  BankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(3000);
    expect(account).toBeInstanceOf(BankAccount);
    expect(account.getBalance()).toBe(3000);
  });

  test('should throw an InsufficientFundsError error when withdrawing is more than balance', () => {
    const account = getBankAccount(3000);
    expect(() => {
      account.withdraw(4000);
    }).toThrowError(new InsufficientFundsError(3000));
  });

  test('should throw an error when transferring is more than balance', () => {
    const account = getBankAccount(3000);
    const transferAccount = getBankAccount(2000);
    expect(() => {
      account.transfer(4000, transferAccount);
    }).toThrowError(new InsufficientFundsError(3000));
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(3000);
    expect(() => {
      account.transfer(4000, account);
    }).toThrowError(new TransferFailedError());
  });

  test('should deposit money', () => {
    const account = getBankAccount(3000);
    account.deposit(1000);
    expect(account.getBalance()).toBe(4000);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(3000);
    account.withdraw(1000);
    expect(account.getBalance()).toBe(2000);
  });

  test('should transfer money', () => {
    const accountSender = getBankAccount(3000);
    const accountReceiver = getBankAccount(2000);
    accountSender.transfer(1000, accountReceiver);
    expect(accountSender.getBalance()).toBe(2000);
    expect(accountReceiver.getBalance()).toBe(3000);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(3000);
    const balance = await account.fetchBalance();
    if (balance !== null) {
      expect(typeof balance).toBe('number');
      expect(balance).toBeGreaterThanOrEqual(0);
      expect(balance).toBeLessThanOrEqual(100);
    } else {
      expect(balance).toBeNull();
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(3000);
    account.fetchBalance = jest.fn().mockResolvedValue(42);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(42);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(3000);
    account.fetchBalance = jest.fn().mockResolvedValue(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
