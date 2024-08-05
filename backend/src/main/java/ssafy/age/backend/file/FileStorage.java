package ssafy.age.backend.file;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import javax.imageio.ImageIO;
import org.jcodec.api.FrameGrab;
import org.jcodec.api.JCodecException;
import org.jcodec.common.io.NIOUtils;
import org.jcodec.common.model.Picture;
import org.jcodec.scale.AWTUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileStorage {
    private static final String DOT_MP4 = ".mp4";
    private static final String DOT_PNG = ".png";

    @Value("${file.video}")
    private String videoDir;

    @Value("${file.video-thumbnail}")
    private String videoThumbnailDir;

    @Value("${file.cam-thumbnail}")
    private String camThumbnailDir;

    private void save(String path, MultipartFile file) throws IOException {
        Files.copy(file.getInputStream(), Path.of(path));
    }

    public void saveVideo(long videoId, MultipartFile file) {
        String path = getVideoPath(videoId);
        try {
            save(path, file);
        } catch (IOException e) {
            throw new RuntimeException("비디오 저장에 실패했습니다.", e);
        }
    }

    private String getVideoPath(long videoId) {
        return videoDir + File.separator + videoId + DOT_MP4;
    }

    public void saveVideoThumbnail(long videoId) {
        String videoPath = getVideoPath(videoId);
        File videoFile = new File(videoPath);
        try {
            FrameGrab grab = FrameGrab.createFrameGrab(NIOUtils.readableChannel(videoFile));
            // 특정 시간으로 이동
            grab.seekToSecondPrecise(2.0);
            // 프레임 추출
            Picture picture = grab.getNativeFrame();
            // Picture를 BufferedImage로 변환
            BufferedImage bufferedImage = AWTUtil.toBufferedImage(picture);
            // 썸네일 이미지 저장
            ImageIO.write(bufferedImage, "png", new File(getVideoThumbnailPath(videoId)));
        } catch (IOException | JCodecException e) {
            throw new RuntimeException("비디오 썸네일 저장에 실패했습니다.", e);
        }
    }

    private String getVideoThumbnailPath(long videoId) {
        return videoThumbnailDir + File.separator + videoId + DOT_PNG;
    }

    public Resource loadVideoResource(Long videoId) {
        String path = getVideoPath(videoId);
        Path file = Path.of(path);
        try {
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            }
            throw new RuntimeException("비디오가 존재하지 않습니다.");
        } catch (MalformedURLException e) {
            throw new RuntimeException("비디오 경로가 잘못되었습니다.", e);
        }
    }
}
