package ssafy.age.backend.video.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.age.backend.video.persistence.Video;
import ssafy.age.backend.video.persistence.VideoRepository;
import ssafy.age.backend.video.web.VideoListResponseDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoService {
    private final VideoRepository videoRepository;

    private final VideoMapper videoMapper = VideoMapper.INSTANCE;

    public List<VideoListResponseDto> getAllVideos(String type, LocalDateTime startDate, LocalDateTime endDate, Long camId) {

        List<Video> videoList = videoRepository.findAllVideos(type, camId, startDate, endDate);

        return videoList.stream()
                .map(video -> {
                    VideoListResponseDto dto = videoMapper.toVideoListResponseDto(video);

                    video.getEventList().stream()
                            .filter(event -> event.getType().name().equals(type) && event.getCam().getId().equals(camId))
                            .findFirst()
                            .ifPresent(event -> {
                                dto.setCamId(event.getCam().getId());
                                dto.setEventId(event.getId());
                                dto.setType(event.getType().name());
                                 // 썸네일 URL 설정 아직...
                            });
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public void deleteVideo(Long videoId) {
        videoRepository.deleteById(videoId);
    }


}
