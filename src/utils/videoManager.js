// Video Concurrency Manager
// Caps active video load requests to 2 concurrent streams to prevent bandwidth throttling.

class VideoQueueManager {
  constructor(maxConcurrent = 2) {
    this.maxConcurrent = maxConcurrent;
    this.activeCount = 0;
    this.queue = [];
  }

  requestLoad(callback) {
    if (this.activeCount < this.maxConcurrent) {
      this.activeCount++;
      callback();
    } else {
      this.queue.push(callback);
    }
  }

  releaseSlot() {
    if (this.activeCount > 0) {
      this.activeCount--;
    }
    if (this.queue.length > 0 && this.activeCount < this.maxConcurrent) {
      this.activeCount++;
      const nextCallback = this.queue.shift();
      nextCallback();
    }
  }

  removeFromQueue(callback) {
    this.queue = this.queue.filter(cb => cb !== callback);
  }
}

export const videoManager = new VideoQueueManager(2);
