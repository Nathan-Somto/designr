import { getCldImageUrl } from "next-cloudinary"

type SizeOpts = {
  width?: number | string;
  height?: number | string;
};
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'default-cloud-name';
export class CloudinaryHelpers {
  static background_remove(src: string, opts?: SizeOpts) {
    return getCldImageUrl({
      src,
      removeBackground: true,
      ...opts,
    }, {
      cloud: {
        cloudName
      }
    });
  }

  static generative_fill(src: string, prompt: string, opts?: SizeOpts) {
    return getCldImageUrl({
      src,
      fillBackground: {
        prompt,
        crop: 'fill',
      },
      ...opts,
    }
      , {
        cloud: {
          cloudName
        }
      }
    );
  }

  static generative_recolor(
    src: string,
    prompt: string,
    to: string,
    opts?: SizeOpts
  ) {
    return getCldImageUrl({
      src,
      recolor: {
        prompt,
        to,
        multiple: true,
      },
      ...opts,
    }
      , {
        cloud: {
          cloudName
        }
      }
    );
  }

  static generative_remove(
    src: string,
    prompt: string,
    opts?: SizeOpts
  ) {
    return getCldImageUrl({
      src,
      remove: {
        prompt,
        multiple: true,
        removeShadow: true
      },
      ...opts,
    }
      , {
        cloud: {
          cloudName
        }
      }
    );
  }

  static generative_restore(src: string, opts?: SizeOpts) {
    return getCldImageUrl({
      src,
      restore: true,
      ...opts,
    }
      , {
        cloud: {
          cloudName
        }
      }
    );
  }
}
