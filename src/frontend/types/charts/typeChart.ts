export interface ChartOptions {
  chart: {
    id: string
    height: number
    type: string
    animations: {
      enabled: boolean
      easing: string
      dynamicAnimation: {
        speed: number
      }
    }
    toolbar: {
      show: boolean
    }
    zoom: {
      enabled: boolean
    }
    sparkline: {
      enabled: boolean
    }
  }
  colors: string[]
  stroke: {
    curve: string
    width: number
  }
  markers: {
    size: number
  }
  tooltip: {
    enabled: boolean
  }
  grid: {
    show: boolean
    padding: {
      left: number
      right: number
    }
  }
  xaxis: {
    type: string
    labels: {
      show: boolean
    }
    axisBorder: {
      show: boolean
    }
    axisTicks: {
      show: boolean
    }
  }
  yaxis: {
    show: boolean
    min: number
  }
}

export interface ChartSeries {
  name: string
  data: number[]
}
