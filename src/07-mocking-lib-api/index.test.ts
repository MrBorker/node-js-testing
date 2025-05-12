import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn().mockImplementation((fn) => fn),
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: { name: 'John' } });

    mockedAxios.create.mockReturnValue({
      get: mockGet,
    } as unknown as ReturnType<typeof axios.create>);

    await throttledGetDataFromApi('/users/1');

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: { id: 1 } });

    mockedAxios.create.mockReturnValue({
      get: mockGet,
    } as unknown as ReturnType<typeof axios.create>);

    await throttledGetDataFromApi('/posts/1');

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith('/posts/1');
  });

  test('should return response data', async () => {
    const mockData = jest.fn().mockResolvedValue({ data: { name: 'John' } });

    mockedAxios.create.mockReturnValue({
      get: mockData,
    } as unknown as ReturnType<typeof axios.create>);

    const data = await throttledGetDataFromApi('/users/1');

    expect(data).toEqual({ name: 'John' });
  });
});
