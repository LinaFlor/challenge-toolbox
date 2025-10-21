import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilesTable from '../components/FilesTable';
import * as filesClient from '../api/filesClient';

jest.mock('../api/filesClient');

describe('FilesTable', () => {
  const fixtureFileData = [
    {
      file: 'file1.csv',
      lines: [
        { text: 'foo', number: 1, hex: '2c74a526dec5a9d9fc8ca46a392ca42c' },
        { text: 'bar', number: 2, hex: '3e29651a63a5202a5661e05a060401fb' },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); 
  });

  const setup = async (mockData = fixtureFileData) => {
    filesClient.getFilesData.mockResolvedValue(mockData);
    await act(async () => {
      render(<FilesTable />);
    });
    if (mockData.length > 0) {
      await waitFor(() =>
        expect(screen.getAllByText(mockData[0].file).length).toBeGreaterThan(0)
      );
    } else {
      await waitFor(() =>
        expect(screen.getByText('No files available.')).toBeInTheDocument()
      );
    }
  };

  it('renders loading spinner initially', () => {
    filesClient.getFilesData.mockReturnValue(new Promise(() => {}));
    render(<FilesTable />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders table with file data', async () => {
    await setup();
    const fileCells = screen.getAllByText('file1.csv');
    expect(fileCells.length).toBe(2);

    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2c74a526dec5a9d9fc8ca46a392ca42c')).toBeInTheDocument();

    expect(screen.getByText('bar')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3e29651a63a5202a5661e05a060401fb')).toBeInTheDocument();
  });

  it('shows error message on fetch error', async () => {
    filesClient.getFilesData.mockRejectedValue({
      response: { data: { message: 'API error' }, status: 500 },
    });
    render(<FilesTable />);
    expect(await screen.findByText('API error')).toBeInTheDocument();
  });

  it('shows no files message if files array is empty', async () => {
    await setup([]);
    expect(screen.getByText('No files available.')).toBeInTheDocument();
  });

  it('filters by file name', async () => {
    await setup();
    const input = screen.getByPlaceholderText('Enter exact file name');
    const filterBtn = screen.getByText('Filter');

    await act(async () => {
      await userEvent.type(input, 'file1.csv');
    });
    filesClient.getFilesData.mockResolvedValueOnce(fixtureFileData);
    await act(async () => {
      await userEvent.click(filterBtn);
    });

    expect(filesClient.getFilesData).toHaveBeenCalledWith('file1.csv');
  });

  it('clears filter and reloads data', async () => {
    await setup();
    const input = screen.getByPlaceholderText('Enter exact file name');
    const clearBtn = screen.getByText('Clear');

    await act(async () => {
      await userEvent.type(input, 'file1.csv');
    });
    filesClient.getFilesData.mockResolvedValueOnce(fixtureFileData);
    await act(async () => {
      await userEvent.click(clearBtn);
    });

    expect(filesClient.getFilesData).toHaveBeenCalledWith('');
  });
});
