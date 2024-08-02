package ssafy.age.backend.video.web;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import javax.imageio.ImageIO;
import org.jcodec.api.FrameGrab;
import org.jcodec.api.JCodecException;
import org.jcodec.common.io.NIOUtils;
import org.jcodec.common.model.Picture;
import org.jcodec.scale.AWTUtil;

public class ThumbnailExtractor {
    public static void createThumbnail(
            String inputVideoPath, String outputImagePath, double startSec)
            throws IOException, JCodecException {
        File videoFile = new File(inputVideoPath);

        FrameGrab grab = FrameGrab.createFrameGrab(NIOUtils.readableChannel(videoFile));

        // 특정 시간으로 이동
        grab.seekToSecondPrecise(startSec);

        // 프레임 추출
        Picture picture = grab.getNativeFrame();

        // Picture를 BufferedImage로 변환
        BufferedImage bufferedImage = AWTUtil.toBufferedImage(picture);

        // 썸네일 이미지 저장
        ImageIO.write(bufferedImage, "png", new File(outputImagePath));
    }
}
