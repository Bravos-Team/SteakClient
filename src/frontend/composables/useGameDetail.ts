import { useGetGameDownloadInfo, useGetGameInfo } from '@/stores/library/useMyLibrary'
import { InstallParams } from '@/types/type'
import { reactive, Ref, watch, watchEffect } from 'vue'

// composables/useGameDetails.ts
export function useGameDetails(gameId: string) {
  const InstallParamsInfo = reactive<InstallParams>({
    appName: '',
    gameInfo: {
      details: {
        id: '',
        thumbnail: '',
        title: '',
        developersTeams: [],
        longDescription: '',
        shortDescription: '',
        regions: [],
        systemRequirements: {
          minimum: {
            osVersion: '',
            cpu: '',
            memory: '',
            storage: '',
            directX: '',
            gpu: '',
          },
          recommend: {
            osVersion: '',
            cpu: '',
            memory: '',
            storage: '',
            directX: '',
            gpu: '',
          },
        },
      },
      genres: [],
      tags: [],
      publisherName: '',
    },
    path: '',
    size: 0,
    installSize: 0,
  } as InstallParams)
  const { data, isSuccess, isLoading, isError } = useGetGameInfo(gameId)
  const { data: downloadInfo, refetch: refetchDownloadInfo } = useGetGameDownloadInfo(gameId)

  watch([data, downloadInfo], ([newData, newDownloadInfo]) => {
    if (newData?.details?.id) {
      Object.assign(InstallParamsInfo, {
        appName: newData.details.id,
        gameInfo: newData,
      })
      if (newDownloadInfo) {
        InstallParamsInfo.size = newDownloadInfo.fileSize
        InstallParamsInfo.installSize = newDownloadInfo.installSize
      }
    }
  })
  return { InstallParamsInfo, isSuccess, isLoading, isError, refetchDownloadInfo }
}

export function useGameDownloadInfo(gameId: string) {
  const { data: downloadInfo } = useGetGameDownloadInfo(gameId)
  const downloadParams = reactive({
    downloadUrl: '',
    fileName: '',
    execPath: '',
    checksum: '',
    fileSize: 0,
    installSize: 0,
  })

  watch([downloadInfo], ([newDownloadInfo]) => {
    if (newDownloadInfo) {
      Object.assign(downloadParams, newDownloadInfo)
    }
  })

  return { downloadParams }
}
