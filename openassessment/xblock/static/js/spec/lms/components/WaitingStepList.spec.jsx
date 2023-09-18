import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import sinon from 'sinon'; 
import WaitingStepList from 'lms/components/WaitingStepList';
import { exact } from 'prop-types';

describe('OpenAssessment.WaitingStepList', () => {
  window.gettext = sinon.fake((text) => text);

  describe('With selectableLearnersEnabled as a prop', () => {
    const WaitingStepListWrapper = ({ children }) => <div data-testid="learners-data-table">{children}</div>

    it('should allow row selection when it is enabled', async () => {
      const studentList = [
        {
          username: 'myusername',
          graded: false,
          graded_by: '2',
          created_at: Date.now(),
          staff_grade_status: 'waiting',
          workflow_status: '',
        },
      ];

      render(
        <IntlProvider locale="en" messages={{}}>
          <WaitingStepListWrapper>
            <WaitingStepList
              selectableLearnersEnabled
              studentList={studentList}
            />
          </WaitingStepListWrapper>
        </IntlProvider>
      );


      await waitFor(() =>  screen.getByTestId('learners-data-table'));
      const dataTable = screen.getByTestId('learners-data-table');

      const firstRowCheckbox = screen.getByTestId('datatable-select-column-checkbox-cell');
      
      expect(dataTable).not.toBeNull();
      expect(firstRowCheckbox).not.toBeNull();
    });

    it('should show review action button when a row is selected', async () => {
  
      const studentList = [
        {
          username: 'myusername',
          graded: false,
          graded_by: '2',
          created_at: Date.now(),
          staff_grade_status: 'waiting',
          workflow_status: '',
        },
      ];

      render(
        <IntlProvider locale="en" messages={{}}>
          <WaitingStepListWrapper>
            <WaitingStepList
              selectableLearnersEnabled
              studentList={studentList}
            />
          </WaitingStepListWrapper>
        </IntlProvider>
      );

      await waitFor(() =>  screen.getByTestId('learners-data-table'));
      const firstRowCheckbox = screen.getByTestId('datatable-select-column-checkbox-cell');

      fireEvent.click(firstRowCheckbox);

      expect(firstRowCheckbox.checked).toBe(true);

      const reviewLearnerButtonAction = screen.getByTestId('review-learner-button');

      expect(reviewLearnerButtonAction).not.toBeNull();;

      //fireEvent.click(findLearnerButton);

      // sinon.assert.calledWith(findLearnerSpy, 'myusername');
    });

    it('should call findLearner function when review action is clicked', async () => {
      // Create a jest spy for the findUsername function
      const findLearnerSpy = sinon.spy();

      const studentList = [
        {
          username: 'myusername',
          graded: false,
          graded_by: '2',
          created_at: Date.now(),
          staff_grade_status: 'waiting',
          workflow_status: '',
        },
      ];

      render(
        <IntlProvider locale="en" messages={{}}>
          <WaitingStepListWrapper>
            <WaitingStepList
              selectableLearnersEnabled
              studentList={studentList}
              findLearner={findLearnerSpy}
            />
          </WaitingStepListWrapper>
        </IntlProvider>
      );

      await waitFor(() =>  screen.getByTestId('learners-data-table'));
      const firstRowCheckbox = screen.getByTestId('datatable-select-column-checkbox-cell');

      fireEvent.click(firstRowCheckbox);

      expect(firstRowCheckbox.checked).toBe(true);

      const reviewLearnerButtonAction = screen.getByTestId('review-learner-button');

      fireEvent.click(reviewLearnerButtonAction);

      sinon.assert.calledWith(findLearnerSpy, 'myusername');
    });

    it('should not show review action button for unselected rows', async () => {
      // Create a jest spy for the findUsername function
      const findLearnerSpy = sinon.spy();

      const studentList = [
        {
          username: 'myusername',
          graded: false,
          graded_by: '2',
          created_at: Date.now(),
          staff_grade_status: 'waiting',
          workflow_status: '',
        },
        {
          username: 'myusername2',
          graded: false,
          graded_by: '4',
          created_at: Date.now(),
          staff_grade_status: 'waiting',
          workflow_status: '',
        }
      ];

      render(
        <IntlProvider locale="en" messages={{}}>
          <WaitingStepListWrapper>
            <WaitingStepList
              selectableLearnersEnabled
              studentList={studentList}
              findLearner={findLearnerSpy}
            />
          </WaitingStepListWrapper>
        </IntlProvider>
      );

      await waitFor(() =>  screen.getByTestId('learners-data-table'));
      const dataTable = screen.getByTestId('learners-data-table');
      const firstDataTableRow = dataTable.querySelector('tbody tr:nth-child(1)');
      const secondDataTableRow = dataTable.querySelector('tbody tr:nth-child(2)');
      const rowCheckboxes = screen.getAllByTestId('datatable-select-column-checkbox-cell');
      const [firstRowCheckbox] = rowCheckboxes;

      fireEvent.click(firstRowCheckbox);

      expect(firstRowCheckbox.checked).toBe(true);

      const reviewButtonInFirstRow = firstDataTableRow.querySelector('[data-testid="review-learner-button"]');
      const reviewButtonInSecondRow = secondDataTableRow.querySelector('[data-testid="review-learner-button"]');
      
      expect(reviewButtonInFirstRow).not.toBeNull();
      expect(reviewButtonInSecondRow).toBeNull();
      /*const reviewLearnerButtonAction = screen.getByTestId('review-learner-button');

      fireEvent.click(reviewLearnerButtonAction);

      sinon.assert.calledWith(findLearnerSpy, 'myusername'); */
    });

    it('should disable other rows when a row is selected', async () => {
      const findLearnerSpy = sinon.spy();

      const studentList = [
        {
          username: 'myusername',
          graded: false,
          graded_by: '2',
          created_at: Date.now(),
          staff_grade_status: 'waiting',
          workflow_status: '',
        },
        {
          username: 'myusername2',
          graded: false,
          graded_by: '4',
          created_at: Date.now(),
          staff_grade_status: 'waiting',
          workflow_status: '',
        },
      ];

      render(
        <IntlProvider locale="en" messages={{}}>
          <WaitingStepListWrapper>
            <WaitingStepList
              selectableLearnersEnabled
              studentList={studentList}
              findLearner={findLearnerSpy}
            />
          </WaitingStepListWrapper>
        </IntlProvider>
      );

      await waitFor(() =>  screen.getByTestId('learners-data-table'));
      const dataTable = screen.getByTestId('learners-data-table');
      const rowCheckboxes = screen.getAllByTestId('datatable-select-column-checkbox-cell');
      const [firstRowCheckbox, secondRowCheckbox] = rowCheckboxes;

      fireEvent.click(firstRowCheckbox);

      expect(firstRowCheckbox.checked).toBe(true);
      // second row should be disabled
      expect(secondRowCheckbox.hasAttribute("disabled")).toBe(true)
    });

  });
});
