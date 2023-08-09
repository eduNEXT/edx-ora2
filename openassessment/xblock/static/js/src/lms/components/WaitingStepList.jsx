import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Button, DataTable, Form } from '@edx/paragon';
import { Search } from '@edx/paragon/icons';

const getReadableTime = (timestamp) => moment(timestamp).fromNow(true);


const currentDate = new Date();

// Calculate the date seven days ago
const sevenDaysAgo = new Date(currentDate);
sevenDaysAgo.setDate(currentDate.getDate() - 7);

const myObject = {
  username: 'sofie_20',
  graded: 1,
  graded_by: 1,
  created_at: sevenDaysAgo,
  staff_grade_status: 'waiting',
  workflow_status: '',
};


const WaitingStepList = ({ studentList, refreshData, findUsername, selectableLearners }) => {
  console.log('Waiting Step List: selectableLearners', selectableLearners)
  const studentListWithTimeAgo = [myObject].map((item) => ({
    ...item,
    created_at: getReadableTime(item.created_at),
  }));

  const RefreshAction = () => (
    <Button onClick={() => refreshData()}>{gettext('Refresh')}</Button>
  );

  const FindLearnerAction = (props) => {
    const {tableInstance: { selectedFlatRows = [] } } = props;
   
    const selectedFlatRowsLength = selectedFlatRows.length;

    if (selectableLearners && selectedFlatRowsLength) {
      const [row] = selectedFlatRows;
      const {
        values: { username },
      } = row;

      const invalidSelection = selectedFlatRowsLength !== 1;

      const handleFindLearnerClick = () => {
        findUsername?.(username);
      };

      return (
        <>
          {invalidSelection && (
            <Form.Control.Feedback type="invalid" className="my-2">
              {gettext("You must select one row")}
            </Form.Control.Feedback>
          )}
          <Button
            iconAfter={Search}
            variant="brand"
            data-testid="find-learner-button"
            disabled={invalidSelection}
            onClick={handleFindLearnerClick}
          >
            {gettext("Search learner")}
          </Button>
        </>
      );
    }

    return null;
  };

  return (
    <DataTable
      itemCount={studentListWithTimeAgo.length}
      data={studentListWithTimeAgo}
      isSelectable={selectableLearners}
      columns={[
        {
          Header: gettext('Username'),
          accessor: 'username',

        },
        {
          Header: gettext('Peers Assessed'),
          accessor: 'graded',
        },
        {
          Header: gettext('Peer Responses Received'),
          accessor: 'graded_by',
        },
        {
          Header: gettext('Time Spent On Current Step'),
          accessor: 'created_at',
        },
        {
          Header: gettext('Staff assessment'),
          accessor: 'staff_grade_status',
        },
        {
          Header: gettext('Grade Status'),
          accessor: 'workflow_status',
        },
      ]}
      tableActions={[
        <RefreshAction />,
        <FindLearnerAction />
      ]}
    >
      <DataTable.TableControlBar />
      <DataTable.Table />
      <DataTable.TableFooter />
    </DataTable>
  );
};

WaitingStepList.propTypes = {
  studentList: PropTypes.arrayOf(PropTypes.object).isRequired,
  refreshData: PropTypes.func,
  findUsername: PropTypes.func,
  selectableLearners: PropTypes.bool,
};

WaitingStepList.defaultProps = {
  refreshData: () => ({}),
  findUsername: undefined,
};

export default WaitingStepList;
