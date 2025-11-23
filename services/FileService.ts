import RNFS from 'react-native-fs';
import {
  getPathToFileDependingOnPlatform,
  getRelativePath,
} from '@utils/helpers/workWithFiles';
import * as Sentry from '@sentry/react-native';

function getRandomFileName(ext: string = ''): string {
  const rand = Math.random().toString(36).substring(2, 10);
  const ts = Date.now();
  return `${ts}_${rand}${ext ? '.' + ext : ''}`;
}

export class FileService {
  static async copyPhotoIfNeeded(photoUrl: string): Promise<string> {
    const originalName = getRelativePath(photoUrl);
    const ext = originalName.includes('.') ? originalName.split('.').pop() : '';
    const randomName = getRandomFileName(ext);
    const newPath = `${RNFS.DocumentDirectoryPath}/${randomName}`;

    if (photoUrl !== newPath) {
      try {
        await RNFS.copyFile(photoUrl, getPathToFileDependingOnPlatform(newPath));
      } catch (e) {
        console.error('Ошибка копирования файла:', e);
        Sentry.captureException(e, {
          tags: { section: 'FileService', action: 'copyPhotoIfNeeded' },
          extra: { message: 'Ошибка копирования файла' }
        });
        throw e;
      }
    }

    return randomName;
  }
}
