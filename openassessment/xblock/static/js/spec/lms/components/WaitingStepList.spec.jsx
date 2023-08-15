import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import sinon from 'sinon'; 
import WaitingStepList from 'lms/components/WaitingStepList';

describe('OpenAssessment.WaitingStepList', () => {
  window.gettext = sinon.fake((text) => text);

  describe('With selectableLearnersEnabled as a prop', () => {
    const WaitingStepListWrapper = ({ children }) => <div data-testid="learners-data-table">{children}</div>

    it('should allow row selection when is true', async () => {
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

      const headerCheckbox = dataTable.querySelector(
        'thead th input[type="checkbox"]'
      );
      const firstRowCheckbox = dataTable.querySelector(
        'tbody tr:first-child td:first-child input[type="checkbox"]'
      );
      
      expect(headerCheckbox).not.toBeNull();
      expect(firstRowCheckbox).not.toBeNull();
    });

    it('should call findLearner function when has 1 row selected', async () => {
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
      const dataTable = screen.getByTestId('learners-data-table');
     
      const firstRowCheckbox = dataTable.querySelector(
        'tbody tr:first-child td:first-child input[type="checkbox"]'
      );

      fireEvent.click(firstRowCheckbox);

      expect(firstRowCheckbox.checked).toBe(true);

      const findLearnerButton = screen.getByTestId('find-learner-button');

      fireEvent.click(findLearnerButton);

      sinon.assert.calledWith(findLearnerSpy, 'myusername');
    });

    it('should show two checkboxes but not call findStudent function when has 2 rows selected', async () => {
      
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
          username: 'timmy_turner',
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
      const dataTable = screen.getByTestId('learners-data-table');

      const firstRowCheckbox = dataTable.querySelector(
        'tbody tr:first-child td:first-child input[type="checkbox"]'
      );
      const secondRowCheckbox = dataTable.querySelector(
        'tbody tr:nth-child(2) td:first-child input[type="checkbox"]'
      );

      fireEvent.click(firstRowCheckbox);
      fireEvent.click(secondRowCheckbox);

      
      expect(firstRowCheckbox.checked).toBe(true);
      expect(secondRowCheckbox.checked).toBe(true);

      const findLearnerButton = screen.getByTestId('find-learner-button');

      fireEvent.click(findLearnerButton);
      
      sinon.assert.notCalled(findLearnerSpy);
    });
    

    it('should not show  find-learner-button when has 0 row selected', async () => {
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
      const dataTable = screen.getByTestId('learners-data-table');

      const firstRowCheckbox = dataTable.querySelector(
        'tbody tr:first-child td:first-child input[type="checkbox"]'
      );

      const findLearnerButton = screen.queryByTestId('find-learner-button');
      
      expect(firstRowCheckbox).not.toBeNull();
      expect(findLearnerButton).toBeNull();
    });
  });
});
