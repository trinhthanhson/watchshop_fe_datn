import ColumnChartStatistics from '../../components/ColumnChartStatistics'
import DashboardStatisGrid from '../../components/inventory/DashboardStatisGrid'
import NewSuppliers from '../../components/inventory/NewSuppliers'
import PieChartInventory from '../../components/inventory/PieChartInventory'
import RecentRequest from '../../components/inventory/RecentRequest'

const DashboardInevntory = () => {
  return (
    <div className="flex flex-col gap-4 w-[80%] ml-[18%]">
      <DashboardStatisGrid />
      <div className="flex flex-row gap-4 w-full">
        <ColumnChartStatistics />
        <PieChartInventory />
      </div>
      <div className="flex flex-row gap-4 w-full">
        <RecentRequest />
        <NewSuppliers />
      </div>
    </div>
  )
}

export default DashboardInevntory
