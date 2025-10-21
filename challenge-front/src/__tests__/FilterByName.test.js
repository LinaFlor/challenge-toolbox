import { render, screen, fireEvent } from '@testing-library/react';
import FilterByName from '../components/FilterByName';

describe('FilterByName', () => {
  it('renders input and buttons', () => {
    render(
      <FilterByName filter="" setFilter={() => {}} handleFilter={() => {}} handleClear={() => {}} />
    );
    expect(screen.getByPlaceholderText('Enter exact file name')).toBeInTheDocument();
    expect(screen.getByText('Filter')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('calls setFilter on input change', () => {
    const setFilter = jest.fn();
    render(
      <FilterByName filter="" setFilter={setFilter} handleFilter={() => {}} handleClear={() => {}} />
    );
    fireEvent.change(screen.getByPlaceholderText('Enter exact file name'), { target: { value: 'abc' } });
    expect(setFilter).toHaveBeenCalledWith('abc');
  });

  it('calls handleFilter when Filter is clicked', () => {
    const handleFilter = jest.fn();
    render(
      <FilterByName filter="abc" setFilter={() => {}} handleFilter={handleFilter} handleClear={() => {}} />
    );
    fireEvent.click(screen.getByText('Filter'));
    expect(handleFilter).toHaveBeenCalled();
  });

  it('calls handleClear when Clear is clicked', () => {
    const handleClear = jest.fn();
    render(
      <FilterByName filter="abc" setFilter={() => {}} handleFilter={() => {}} handleClear={handleClear} />
    );
    fireEvent.click(screen.getByText('Clear'));
    expect(handleClear).toHaveBeenCalled();
  });

  it('disables Filter button when filter is empty or whitespace', () => {
    const { rerender } = render(
      <FilterByName filter="" setFilter={() => {}} handleFilter={() => {}} handleClear={() => {}} />
    );
    expect(screen.getByText('Filter')).toBeDisabled();
    rerender(<FilterByName filter="   " setFilter={() => {}} handleFilter={() => {}} handleClear={() => {}} />);
    expect(screen.getByText('Filter')).toBeDisabled();
  });
});
