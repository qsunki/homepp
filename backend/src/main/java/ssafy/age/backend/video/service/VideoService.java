package ssafy.age.backend.video.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.age.backend.event.persistence.EventType;
import ssafy.age.backend.video.exception.VideoNotFoundException;
import ssafy.age.backend.video.persistence.Video;
import ssafy.age.backend.video.persistence.VideoRepository;
import ssafy.age.backend.video.web.EventDetailDto;
import ssafy.age.backend.video.web.VideoResponseDto;

@Service
@RequiredArgsConstructor
public class VideoService {
    private final VideoRepository videoRepository;
    private final VideoMapper videoMapper = VideoMapper.INSTANCE;

    public List<VideoResponseDto> getAllVideos(
            List<EventType> types,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long camId,
            boolean isThreat) {

        List<Video> videoList =
                videoRepository.findAllVideos(types, startDate, endDate, camId, isThreat);

        return videoList.stream()
                .map(
                        video -> {
                            VideoResponseDto dto = videoMapper.toVideoResponseDto(video);

                            List<EventDetailDto> eventDetails =
                                    video.getEventList().stream()
                                            .map(videoMapper::toEventDetailDto)
                                            .collect(Collectors.toList());
                            dto.setEventDetails(eventDetails);

                            video.getEventList().stream()
                                    .findFirst()
                                    .ifPresent(event -> dto.setCamName(event.getCam().getName()));

                            return dto;
                        })
                .collect(Collectors.toList());
    }

    public VideoResponseDto getVideoById(Long videoId) {

        Video video = videoRepository.findById(videoId).orElseThrow(VideoNotFoundException::new);

        VideoResponseDto dto = videoMapper.toVideoResponseDto(video);

        List<EventDetailDto> eventDetails =
                video.getEventList().stream()
                        .map(videoMapper::toEventDetailDto)
                        .collect(Collectors.toList());
        dto.setEventDetails(eventDetails);

        video.getEventList().stream()
                .findFirst()
                .ifPresent(event -> dto.setCamName(event.getCam().getName()));

        return dto;
    }

    public void deleteVideo(Long videoId) {
        videoRepository.deleteById(videoId);
    }
}
